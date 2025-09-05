import React from 'react'

const ChatMessages = ({ selectedChat, messages }) => {
  if (!selectedChat) {
    return <p>Please select a chat from the sidebar to start messaging.</p>
  }

  if (messages.length === 0) {
    return <p>No messages yet. Start the conversation!</p>
  }

  return (
    <>
      {messages.map((msg) => (
        <div key={msg.id} className="bg-gray-200 p-2 rounded w-fit max-w-xs">
          {msg.text && <p className="text-sm text-black mb-1">{msg.text}</p>}
          {msg.image && (
            <img
              src={msg.image}
              alt="uploaded"
              className="rounded max-w-full max-h-60 mb-1"
            />
          )}
          <span className="text-xs text-gray-500">
            {new Date(msg.timestamp).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </>
  )
}

export default ChatMessages
