import React from 'react';

const getUsername = (email) => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  return user ? user.username : email;
};

const PendingRequests = ({ requests, onAccept }) => {
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Friend Requests</h3>
      {requests.length === 0 ? (
        <p className="text-sm text-gray-500">No pending requests</p>
      ) : (
        <ul className="space-y-2">
          {requests.map((email) => (
            <li key={email} className="flex justify-between items-center">
              <span className="text-sm">{getUsername(email)}</span>
              <button
                onClick={() => onAccept(email)}
                className="bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600 transition duration-200"
              >
                Accept
              </button>
            </li>
          ))}
        </ul>
    )}
    </div>
  );
};

export default PendingRequests;