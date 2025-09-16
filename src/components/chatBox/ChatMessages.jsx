import React from 'react';

const ChatMessages = ({ messages, currentUserEmail }) => {
  return (
    <div>
      {messages.length === 0 ? (
        <p className="text-gray-500 text-center">No messages yet</p>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 flex ${msg.sender === currentUserEmail ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                msg.sender === currentUserEmail
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              {msg.image && (
                <img
                  src={msg.image}
                  alt="attachment"
                  className="max-w-xs max-h-48 rounded mt-2"
                  onError={(e) => console.error('Image load failed:', msg.image)}
                />
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatMessages;