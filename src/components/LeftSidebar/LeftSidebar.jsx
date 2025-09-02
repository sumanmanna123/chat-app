import React from 'react'

const chatList = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'John' },
  { id: 4, name: 'IronMan' },
]

const LeftSidebar = ({ onSelectChat, selectedChat }) => {
  return (
    <div className="h-screen w-1/5 backdrop-filter backdrop-blur-xs border-r shadow-sm p-4">
      <h2 className="text-xl font-bold mb-4">Chats</h2>
      <ul className="space-y-2">
        {chatList.map((chat) => (
          <li
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className={`p-2 rounded cursor-pointer ${
              selectedChat?.id === chat.id ? 'bg-green-200 font-semibold' : 'hover:bg-green-100'
            }`}
          >
            {chat.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LeftSidebar
