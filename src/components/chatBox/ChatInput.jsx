import React, { useState, useRef } from "react";

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (data.imageUrl) {
          setImage(`http://localhost:5000${data.imageUrl}`);
        }
      } catch {
        // fail silently
      }
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() && !image && !imagePreview) return;

    onSend({
      text: text.trim(),
      image: image || imagePreview || null,
    });

    setText("");
    handleRemoveImage();
  };

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 border-t border-gray-700 shadow-lg">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-600 rounded px-4 py-2 text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="border border-gray-600 rounded px-2 py-2 text-white bg-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200"
        >
          Send
        </button>
      </form>
      {imagePreview && (
        <div className="mt-2">
          <p className="text-sm text-gray-300">Image preview:</p>
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="preview"
              className="max-w-xs max-h-48 rounded mt-2"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
