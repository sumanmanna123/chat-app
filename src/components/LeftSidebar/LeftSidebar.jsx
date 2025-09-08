import React, { useState, useEffect } from 'react';
import FriendRequestInput from './FriendRequestInput';
import PendingRequests from './PendingRequests';
import FriendList from './FriendList';

const LeftSidebar = ({ onSelectChat, selectedChat }) => {
  const [emailToAdd, setEmailToAdd] = useState('');
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    if (!currentUser) return;

    const requests = JSON.parse(localStorage.getItem('friendRequests')) || {};
    setFriendRequests(requests[currentUser.email] || []);

    const allFriends = JSON.parse(localStorage.getItem('friends')) || {};
    setFriends(allFriends[currentUser.email] || []);

    const unread = JSON.parse(localStorage.getItem('unreadCounts')) || {};
    setUnreadCounts(unread);
  }, [selectedChat]);

  const handleSendRequest = () => {
    if (emailToAdd === currentUser.email) {
      alert("You can't add yourself.");
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.find((user) => user.email === emailToAdd);
    if (!userExists) {
      alert("User does not exist.");
      return;
    }

    const requests = JSON.parse(localStorage.getItem('friendRequests')) || {};
    const recipientRequests = requests[emailToAdd] || [];

    if (!recipientRequests.includes(currentUser.email)) {
      recipientRequests.push(currentUser.email);
      requests[emailToAdd] = recipientRequests;
      localStorage.setItem('friendRequests', JSON.stringify(requests));
      alert('Friend request sent.');
    } else {
      alert('Friend request already sent.');
    }

    setEmailToAdd('');
  };

  const acceptRequest = (email) => {
    const allFriends = JSON.parse(localStorage.getItem('friends')) || {};
    const myFriends = allFriends[currentUser.email] || [];
    const theirFriends = allFriends[email] || [];

    if (!myFriends.includes(email)) {
      myFriends.push(email);
      theirFriends.push(currentUser.email);
    }

    allFriends[currentUser.email] = myFriends;
    allFriends[email] = theirFriends;

    localStorage.setItem('friends', JSON.stringify(allFriends));
    setFriends(myFriends);

    const allRequests = JSON.parse(localStorage.getItem('friendRequests')) || {};
    const updatedRequests = (allRequests[currentUser.email] || []).filter((req) => req !== email);
    allRequests[currentUser.email] = updatedRequests;
    localStorage.setItem('friendRequests', JSON.stringify(allRequests));

    setFriendRequests(updatedRequests);
  };

  const handleSelectChat = (email) => {
    const unread = JSON.parse(localStorage.getItem('unreadCounts')) || {};
    unread[email] = 0;
    localStorage.setItem('unreadCounts', JSON.stringify(unread));
    setUnreadCounts(unread);

    onSelectChat({ id: email, name: email });
  };

  if (!currentUser) {
    return (
      <div className="w-1/5 bg-white border-r p-4 overflow-y-auto">
        <p className="text-red-500">User not logged in.</p>
      </div>
    );
  }

  return (
    <div className="w-1/5 bg-white border-r p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Welcome, {currentUser.username}</h2>

      <FriendRequestInput
        emailToAdd={emailToAdd}
        setEmailToAdd={setEmailToAdd}
        handleSendRequest={handleSendRequest}
      />

      <PendingRequests
        requests={friendRequests}
        onAccept={acceptRequest}
      />

      <FriendList
        friends={friends}
        unreadCounts={unreadCounts}
        selectedChat={selectedChat}
        onSelect={handleSelectChat}
      />
    </div>
  );
};

export default LeftSidebar;
