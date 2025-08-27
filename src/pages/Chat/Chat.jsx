import React from 'react'
import LeftSidebar from '../../components/LeftSidebar/LeftSidebar'
import ChatBox from '../../components/chatBox/ChatBox'
import RightSidebar from '../../components/rightSidebar/RightSidebar'

const Chat = () => {
  return (
    <div className="bg-[url('src/assets/chat-bg.jpg')] flex">

  
          <LeftSidebar/>
       
          <ChatBox/>
       
          <RightSidebar/>
      
    </div>
  )
}

export default Chat