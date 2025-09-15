const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'Uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// In-memory storage
let users = [];
let messages = {};
let friendRequests = {};
let friends = {};
let unreadCounts = {};

app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  console.log('Signup attempt:', { username, email }); 
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const emailLower = email.toLowerCase();
  if (users.find(user => user.email.toLowerCase() === emailLower)) {
    return res.status(400).json({ error: 'User already exists' });
  }
  users.push({ username, email: emailLower, password });
  console.log('Users after signup:', users);
  res.json({ message: 'Signup successful', user: { username, email: emailLower } });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email }); 
  const emailLower = email.toLowerCase();
  const user = users.find(user => user.email.toLowerCase() === emailLower && user.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ user: { username: user.username, email: user.email } });
});

app.get('/users/:email', (req, res) => {
  const { email } = req.params;
  console.log('User lookup:', email); 
  const emailLower = email.toLowerCase();
  const user = users.find(u => u.email.toLowerCase() === emailLower);
  if (user) {
    res.json({ username: user.username, email: user.email });
  } else {
    console.log('Users checked:', users); 
    res.status(404).json({ error: 'User not found' });
  }
});

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('login', (userEmail) => {
    console.log(`User ${userEmail} logged in`);
    socket.join(userEmail.toLowerCase());
    socket.emit('init', {
      friendRequests: friendRequests[userEmail.toLowerCase()] || [],
      friends: friends[userEmail.toLowerCase()] || [],
      unreadCounts: unreadCounts[userEmail.toLowerCase()] || {}
    });
  });

  socket.on('sendFriendRequest', ({ from, to }) => {
    const fromLower = from.toLowerCase();
    const toLower = to.toLowerCase();
    console.log(`Friend request from ${fromLower} to ${toLower}`);
    if (!friendRequests[toLower]) friendRequests[toLower] = [];
    if (!friendRequests[toLower].includes(fromLower)) {
      friendRequests[toLower].push(fromLower);
      io.to(toLower).emit('friendRequest', { from: fromLower });
    }
  });

  socket.on('acceptFriendRequest', ({ from, to }) => {
    const fromLower = from.toLowerCase();
    const toLower = to.toLowerCase();
    console.log(`Accepting friend request from ${fromLower} to ${toLower}`);
    if (!friends[fromLower]) friends[fromLower] = [];
    if (!friends[toLower]) friends[toLower] = [];
    if (!friends[fromLower].includes(toLower)) friends[fromLower].push(toLower);
    if (!friends[toLower].includes(fromLower)) friends[toLower].push(fromLower);
    friendRequests[toLower] = (friendRequests[toLower] || []).filter(email => email !== fromLower);
    io.to(fromLower).emit('friendUpdate', { friends: friends[fromLower], friendRequests: friendRequests[fromLower] });
    io.to(toLower).emit('friendUpdate', { friends: friends[toLower], friendRequests: friendRequests[toLower] });
  });

  socket.on('sendMessage', ({ sender, recipient, text, image }) => {
    const senderLower = sender.toLowerCase();
    const recipientLower = recipient.toLowerCase();
    console.log(`Message from ${senderLower} to ${recipientLower}: ${text || image}`);
    const chatId = [senderLower, recipientLower].sort().join('-');
    if (!messages[chatId]) messages[chatId] = [];
    const newMessage = { id: Date.now(), sender: senderLower, text, image, timestamp: new Date().toISOString() };
    messages[chatId].push(newMessage);
    if (!unreadCounts[recipientLower]) unreadCounts[recipientLower] = {};
    unreadCounts[recipientLower][senderLower] = (unreadCounts[recipientLower][senderLower] || 0) + 1;
    io.to(senderLower).emit('message', { chatId, messages: messages[chatId], unreadCounts: unreadCounts[senderLower] });
    io.to(recipientLower).emit('message', { chatId, messages: messages[chatId], unreadCounts: unreadCounts[recipientLower] });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(5000, () => console.log('Server running on port 5000'));