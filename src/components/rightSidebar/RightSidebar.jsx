import React from 'react'

const RightSidebar = ({ selectedChat }) => {
  if (!selectedChat) {
    return (
      <aside className="h-screen w-1/5 backdrop-filter backdrop-blur-xs border-l shadow-sm p-4 text-gray-500">
        <h2 className="text-xl font-bold mb-4">User Info</h2>
        <p>Select a chat to view details.</p>
      </aside>
    )
  }

  // Dummy avatars based on name (replace with actual avatars or Firebase)
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    selectedChat.name
  )}&background=0D8ABC&color=fff`

  return (
    <aside className="h-screen w-1/5 bg-white border-l shadow-sm p-4">
      <h2 className="text-xl font-bold mb-4">User Info</h2>

      <div className="flex flex-col items-center space-y-2">
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="rounded-full w-20 h-20 shadow"
        />
        <h3 className="text-lg font-semibold">{selectedChat.name}</h3>
        <p className="text-sm text-green-600">Online</p>
      </div>

      <div className="mt-6">
        <h4 className="text-md font-semibold mb-2">About</h4>
        <p className="text-sm text-gray-600">
          This is the user bio or chat description for <strong>{selectedChat.name}</strong>.
        </p>
      </div>

      <div className="mt-6 space-y-2">
        <button className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Start Call
        </button>
        <button className="w-full py-2 border border-red-500 text-red-500 rounded hover:bg-red-50">
          Block User
        </button>
      </div>
    </aside>
  )
}

export default RightSidebar
