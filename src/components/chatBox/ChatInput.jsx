import React, { useState } from 'react';

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() && !image) return;
    onSend({ text: message.trim(), image });
    setMessage('');
    setImage(null);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      try {
        const response = await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formData
        });
        const { imageUrl } = await response.json();
        setImage(`http://localhost:5000${imageUrl}`);
      } catch (error) {
        console.error('Image upload failed:', error);
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 border-t border-gray-700 shadow-lg">
      <form onSubmit={handleSendMessage} className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border border-gray-600 rounded px-4 py-2 text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="border border-gray-600 rounded px-2 py-2 text-white bg-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200"
        >
          Send
        </button>
      </form>
      {image && (
        <div className="mt-2">
          <p className="text-sm text-gray-300">Image preview:</p>
          <img src={image} alt="preview" className="max-w-xs max-h-48 rounded mt-2" />
        </div>
      )}
    </div>
  );
};

export default ChatInput;