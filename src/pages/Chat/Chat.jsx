import React, { useState } from 'react'
import LeftSidebar from '../../components/LeftSidebar/LeftSidebar'
import ChatBox from '../../components/chatBox/ChatBox'
import RightSidebar from '../../components/rightSidebar/RightSidebar'
import bgImage from '../../assets/chat-bg.jpg'

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null)

  return (
    <div
      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover' }}
      className="flex h-screen"
    >
      <LeftSidebar onSelectChat={setSelectedChat} selectedChat={selectedChat} />
      <ChatBox selectedChat={selectedChat} />
      <RightSidebar />
    </div>
  )
}

export default Chat
