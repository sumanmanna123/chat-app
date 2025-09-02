import React, { useState } from 'react'

const ChatBox = ({ selectedChat }) => {
  const [message, setMessage] = useState('')

  const handleInputChange = (e) => {
    setMessage(e.target.value)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!message.trim()) return

    console.log(`Sending message to ${selectedChat.name}:`, message)

    setMessage('')
  }

  return (
    <div className="h-screen w-3/5 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4 shadow-sm">
        <h2 className="text-lg font-semibold">
          {selectedChat ? `Chat with ${selectedChat.name}` : 'Select a chat'}
        </h2>
      </div>

      {/* Chat area */}
      <div className="flex-1 p-4 overflow-y-auto text-gray-500">
        {selectedChat ? (
          <p>Chat messages with <strong>{selectedChat.name}</strong> will appear here.</p>
        ) : (
          <p>Please select a chat from the sidebar to start messaging.</p>
        )}
      </div>

      {/* Typing Input */}
      {selectedChat && (
        <div className="p-4 bg-white border-t">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={handleInputChange}
              className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default ChatBox
