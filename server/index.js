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
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });


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
  const user = users.find(
    user => user.email.toLowerCase() === emailLower && user.password === password
  );

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


app.get('/debug/rooms', (req, res) => {
  const rooms = [...io.sockets.adapter.rooms];
  console.log('Active socket rooms:', rooms);
  res.json(rooms);
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('login', (userEmail) => {
    try {
      const emailLower = userEmail.toLowerCase();
      console.log(`User ${emailLower} logged in`);

      socket.join(emailLower);

      console.log(`Socket ${socket.id} joined room: ${emailLower}`);
      socket.emit('init', {
        friendRequests: friendRequests[emailLower] || [],
        friends: friends[emailLower] || [],
        unreadCounts: unreadCounts[emailLower] || {}
      });
    } catch (error) {
      console.error(`Error in login handler for ${userEmail}:`, error.message);
    }
  });

  socket.on('sendFriendRequest', ({ from, to }) => {
    try {
      const fromLower = from.toLowerCase();
      const toLower = to.toLowerCase();

      console.log(`Friend request from ${fromLower} to ${toLower}`);

      if (!friendRequests[toLower]) friendRequests[toLower] = [];
      if (!friendRequests[toLower].includes(fromLower)) {
        friendRequests[toLower].push(fromLower);
        io.to(toLower).emit('friendRequest', { from: fromLower });
      }
    } catch (error) {
      console.error(`Error in sendFriendRequest from ${from} to ${to}:`, error.message);
    }
  });

  socket.on('acceptFriendRequest', ({ from, to }) => {
    try {
      const fromLower = from.toLowerCase();
      const toLower = to.toLowerCase();

      console.log(`Accepting friend request from ${fromLower} to ${toLower}`);

      if (!friends[fromLower]) friends[fromLower] = [];
      if (!friends[toLower]) friends[toLower] = [];

      if (!friends[fromLower].includes(toLower)) friends[fromLower].push(toLower);
      if (!friends[toLower].includes(fromLower)) friends[toLower].push(fromLower);

      friendRequests[toLower] = (friendRequests[toLower] || []).filter(email => email !== fromLower);

      io.to(fromLower).emit('friendUpdate', {
        friends: friends[fromLower],
        friendRequests: friendRequests[fromLower]
      });
      io.to(toLower).emit('friendUpdate', {
        friends: friends[toLower],
        friendRequests: friendRequests[toLower]
      });
    } catch (error) {
      console.error(`Error in acceptFriendRequest from ${from} to ${to}:`, error.message);
    }
  });

  socket.on('sendMessage', ({ sender, recipient, text, image }) => {
    try {
      const senderLower = sender.toLowerCase();
      const recipientLower = recipient.toLowerCase();
      const chatId = [senderLower, recipientLower].sort().join('-');

      if (!messages[chatId]) messages[chatId] = [];

      const newMessage = {
        id: Date.now(),
        sender: senderLower,
        text,
        image,
        timestamp: new Date().toISOString()
      };

      messages[chatId].push(newMessage);
      console.log(`New message in chat ${chatId}:`, newMessage);

      if (!unreadCounts[recipientLower]) unreadCounts[recipientLower] = {};
      unreadCounts[recipientLower][senderLower] =
        (unreadCounts[recipientLower][senderLower] || 0) + 1;

      io.to(senderLower).emit('message', {
        chatId,
        messages: messages[chatId],
        unreadCounts: unreadCounts[senderLower] || {}
      });
      io.to(recipientLower).emit('message', {
        chatId,
        messages: messages[chatId],
        unreadCounts: unreadCounts[recipientLower] || {}
      });
    } catch (error) {
      console.error(`Error in sendMessage from ${sender} to ${recipient}:`, error.message);
    }
  });

  socket.on('loadMessages', ({ chatId, userEmail }) => {
    try {
      console.log(`Loading messages for chatId: ${chatId}, user: ${userEmail}`);
      const emailLower = userEmail.toLowerCase();
      const [user1, user2] = chatId.split('-');

      if (emailLower === user1 || emailLower === user2) {
        const otherUser = emailLower === user1 ? user2 : user1;

        if (!unreadCounts[emailLower]) unreadCounts[emailLower] = {};
        unreadCounts[emailLower][otherUser] = 0;

        console.log(`Sending chatLoaded to ${emailLower} for chatId: ${chatId}`);

        socket.emit('chatLoaded', { chatId, messages: messages[chatId] || [] });
        io.to(emailLower).emit('message', {
          chatId,
          messages: messages[chatId] || [],
          unreadCounts: unreadCounts[emailLower] || {}
        });
      } else {
        console.log(`Unauthorized access to chatId: ${chatId} by ${userEmail}`);
        socket.emit('chatLoaded', { chatId, messages: [] });
      }
    } catch (error) {
      console.error(`Error in loadMessages for chatId ${chatId}, user ${userEmail}:`, error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});


server.listen(5000, () => console.log('Server running on port 5000'));
