import React from 'react';

const ChatHeader = ({ selectedChat }) => {
  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 p-4 shadow-lg">
      <h2 className="text-lg font-semibold text-white">
        {selectedChat ? `Chat with ${selectedChat.name}` : 'Select a chat'}
      </h2>
    </div>
  );
};

export default ChatHeader;