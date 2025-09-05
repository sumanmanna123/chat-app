import React from 'react'

const ChatHeader = ({ selectedChat }) => {
  return (
    <div className="bg-white border-b p-4 shadow-sm">
      <h2 className="text-lg font-semibold">
        {selectedChat ? `Chat with ${selectedChat.name}` : 'Select a chat'}
      </h2>
    </div>
  )
}

export default ChatHeader
