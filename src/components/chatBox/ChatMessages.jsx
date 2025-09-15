import React from "react";

const getUsername = (email) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === email);
  return user ? user.username : email;
};

const ChatMessages = ({ selectedChat, messages, currentUserEmail }) => {
  if (!selectedChat) {
    return <p>Please select a chat from the sidebar to start messaging.</p>;
  }
  if (messages.length === 0) {
    return <p>No messages yet. Start the conversation!</p>;
  }
  return (
    <div className="flex flex-col space-y-4">
      {messages.map((msg) => {
        const isMine = msg.sender === currentUserEmail;
        return (
          <div
            key={msg.id}
            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                isMine ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              {!isMine && (
                <p className="text-sm font-semibold mb-1">
                  {getUsername(msg.sender)}
                </p>
              )}
              {msg.text && <p className="text-sm mb-1">{msg.text}</p>}
              {msg.image && (
                <img
                  src={
                    msg.image.startsWith("http")
                      ? msg.image
                      : `http://localhost:5000${msg.image}`
                  }
                  alt="uploaded"
                  className="rounded max-w-full max-h-60 mb-1"
                  onError={(e) =>
                    console.log("Image load error:", e.target.src)
                  }
                />
              )}
              <span className="text-xs text-gray-500 block text-right">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
              {isMine && (
                <p className="text-sm font-semibold mb-1 text-right">You</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatMessages;
