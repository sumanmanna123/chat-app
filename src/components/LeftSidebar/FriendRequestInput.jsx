import React from 'react';

const FriendRequestInput = ({ emailToAdd, setEmailToAdd, handleSendRequest }) => (
  <div className="mb-4">
    <input
      type="email"
      placeholder="Add friend by email"
      value={emailToAdd}
      onChange={(e) => setEmailToAdd(e.target.value)}
      className="border w-full px-2 py-1 rounded mb-2"
    />
    <button
      onClick={handleSendRequest}
      className="bg-blue-500 text-white w-full py-1 rounded hover:bg-blue-600"
    >
      Send Friend Request
    </button>
  </div>
);

export default FriendRequestInput;
