import React, { useState, useEffect } from 'react'
import ChatHeader from './ChatHeader'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'

const ChatBox = ({ selectedChat }) => {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    if (selectedChat) {
      const storedMessages = localStorage.getItem(`chatMessages-${selectedChat.id}`)
      setMessages(storedMessages ? JSON.parse(storedMessages) : [])
    }
  }, [selectedChat])

  const handleSend = ({ text, image }) => {
    if (!selectedChat) return

    const newMessage = {
      id: Date.now(),
      text,
      image,
      sender: 'You',
      timestamp: new Date().toISOString(),
    }

    const updatedMessages = [...messages, newMessage]
    setMessages(updatedMessages)
    localStorage.setItem(`chatMessages-${selectedChat.id}`, JSON.stringify(updatedMessages))
  }

  return (
    <div className="h-screen w-4/5 flex flex-col">
      <ChatHeader selectedChat={selectedChat} />

      <div className="flex-1 p-4 overflow-y-auto text-gray-700 space-y-4">
        <ChatMessages selectedChat={selectedChat} messages={messages} />
      </div>

      {selectedChat && <ChatInput onSend={handleSend} />}
    </div>
  )
}

export default ChatBox
