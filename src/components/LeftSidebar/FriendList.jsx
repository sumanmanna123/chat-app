import React from 'react';

const getUsername = (email) => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  return user ? user.username : email;
};

const FriendList = ({ friends, unreadCounts, selectedChat, onSelect }) => {
  console.log('Rendering FriendList with friends:', friends); // Debug log
  return (
    <div>
      <h3 className="font-semibold mb-2">Friends</h3>
      {friends.length === 0 ? (
        <p className="text-sm text-gray-500">No friends yet</p>
      ) : (
        <ul className="space-y-2">
          {friends.map((email) => (
            <li
              key={email}
              onClick={() => onSelect(email)}
              className={`cursor-pointer p-2 rounded hover:bg-gray-200 ${
                selectedChat?.id === email.toLowerCase() ? 'bg-gray-300' : ''
              } flex justify-between items-center`}
            >
              <span className="text-sm">{getUsername(email)}</span>
              {unreadCounts[email] > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadCounts[email]}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendList;