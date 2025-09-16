import React, { useState, useEffect, useMemo } from "react";
import FriendRequestInput from "./FriendRequestInput";
import PendingRequests from "./PendingRequests";
import FriendList from "./FriendList";
import io from "socket.io-client";

const socket = io("http://localhost:5000", {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const LeftSidebar = ({ onSelectChat, selectedChat }) => {
  const [emailToAdd, setEmailToAdd] = useState("");
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const currentUser = useMemo(
    () => JSON.parse(sessionStorage.getItem("currentUser")) || null,
    []
  );

  useEffect(() => {
    if (!currentUser) return;

    socket.on("connect", () => {
      socket.emit("login", currentUser.email.toLowerCase());
    });

    socket.on("init", ({ friendRequests, friends, unreadCounts }) => {
      setFriendRequests(friendRequests || []);
      setFriends(friends || []);
      setUnreadCounts(unreadCounts || {});
    });

    socket.on("friendRequest", ({ from }) => {
      setFriendRequests((prev) => [...new Set([...prev, from])]);
    });

    socket.on(
      "friendUpdate",
      ({ friends: updatedFriends, friendRequests: updatedRequests }) => {
        setFriends(updatedFriends || []);
        setFriendRequests(updatedRequests || []);
      }
    );

    socket.on("message", ({ unreadCounts: updatedUnread }) => {
      setUnreadCounts(updatedUnread || {});
    });

    if (socket.connected) {
      socket.emit("login", currentUser.email.toLowerCase());
    }

    return () => {
      socket.off("init");
      socket.off("friendRequest");
      socket.off("friendUpdate");
      socket.off("message");
      socket.off("connect_error");
      socket.off("connect");
    };
  }, [currentUser]);

  const handleSendRequest = async () => {
    if (
      !currentUser ||
      emailToAdd.toLowerCase() === currentUser.email.toLowerCase()
    ) {
      alert("You can't add yourself.");
      return;
    }
    try {
      const emailToAddLower = emailToAdd.toLowerCase();
      const response = await fetch(
        `http://localhost:5000/users/${encodeURIComponent(emailToAddLower)}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "User does not exist.");
        return;
      }
      const { username } = await response.json();
      socket.emit("sendFriendRequest", {
        from: currentUser.email.toLowerCase(),
        to: emailToAddLower,
      });
      setEmailToAdd("");
      alert(`Friend request sent to ${username || emailToAddLower}`);
    } catch {
      alert("Network error. Please check your connection and try again.");
    }
  };

  const acceptRequest = (email) => {
    const emailLower = email.toLowerCase();
    socket.emit("acceptFriendRequest", {
      from: currentUser.email.toLowerCase(),
      to: emailLower,
    });
    setFriendRequests((prevRequests) =>
      prevRequests.filter((req) => req.toLowerCase() !== emailLower)
    );
  };

  const getUsername = async (email) => {
    try {
      const response = await fetch(
        `http://localhost:5000/users/${encodeURIComponent(email.toLowerCase())}`
      );
      if (!response.ok) return email;
      const { username } = await response.json();
      return username || email;
    } catch {
      return email;
    }
  };

  const handleSelectChat = async (email) => {
    const username = await getUsername(email);
    setUnreadCounts((prev) => ({ ...prev, [email.toLowerCase()]: 0 }));
    onSelectChat({ id: email.toLowerCase(), name: username });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    socket.disconnect();
    window.location.href = "/";
  };

  if (!currentUser) {
    return (
      <div className="w-1/5 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto text-red-500">
        <p>User not logged in.</p>
      </div>
    );
  }

  return (
    <div className="w-1/5 bg-gradient-to-r from-gray-800 to-gray-900 border-r border-gray-700 p-4 overflow-y-auto text-white shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Welcome, {currentUser.username}</h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded transition duration-200"
        >
          Logout
        </button>
      </div>
      <FriendRequestInput
        emailToAdd={emailToAdd}
        setEmailToAdd={setEmailToAdd}
        handleSendRequest={handleSendRequest}
      />
      <PendingRequests
        key={friendRequests.length}
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
