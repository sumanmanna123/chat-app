import React, { useState } from 'react'

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState('')
  const [image, setImage] = useState(null)

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!message.trim() && !image) return

    onSend({
      text: message.trim(),
      image,
    })

    setMessage('')
    setImage(null)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="p-4 bg-white border-t">
      <form onSubmit={handleSendMessage} className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="border border-gray-300 rounded px-2 py-2 text-sm"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </form>

      {image && (
        <div className="mt-2">
          <p className="text-sm text-gray-500">Image preview:</p>
          <img src={image} alt="preview" className="max-w-xs max-h-48 rounded" />
        </div>
      )}
    </div>
  )
}

export default ChatInput
