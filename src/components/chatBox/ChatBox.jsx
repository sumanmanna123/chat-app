import React, { useState, useEffect, useMemo } from "react";
import io from "socket.io-client";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const socket = io("http://localhost:5000", {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const ChatBox = ({ selectedChat }) => {
  const [messages, setMessages] = useState([]);
  const currentUser = useMemo(
    () => JSON.parse(sessionStorage.getItem("currentUser")) || null,
    []
  );

  const getChatId = () => {
    if (!selectedChat || !currentUser) return null;
    return [currentUser.email, selectedChat.id].sort().join("-");
  };

  const chatId = useMemo(getChatId, [selectedChat, currentUser]);

  useEffect(() => {
    if (!currentUser || !selectedChat) {
      setMessages([]);
      return;
    }

    const handleMessage = ({
      chatId: incomingChatId,
      messages: incomingMessages,
    }) => {
      console.log("Received message:", { incomingChatId, incomingMessages });
      if (incomingChatId === chatId) {
        setMessages(incomingMessages || []);
      }
    };

    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("login", currentUser.email);
    });

    socket.on("message", handleMessage);

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    if (socket.connected) {
      socket.emit("login", currentUser.email);
    }

    return () => {
      socket.off("message", handleMessage);
      socket.off("connect");
      socket.off("connect_error");
    };
  }, [chatId, currentUser]);

  const handleSend = ({ text, image }) => {
    if (!selectedChat || !currentUser) return;
    socket.emit("sendMessage", {
      sender: currentUser.email,
      recipient: selectedChat.id,
      text,
      image: image || null, // Ensure image is passed as is
    });
  };

  return (
    <div className="h-screen w-4/5 flex flex-col">
      <ChatHeader selectedChat={selectedChat} />
      <div className="flex-1 p-4 overflow-y-auto text-gray-700 space-y-4">
        <ChatMessages
          selectedChat={selectedChat}
          messages={messages}
          currentUserEmail={currentUser?.email}
        />
      </div>
      {selectedChat && currentUser && <ChatInput onSend={handleSend} />}
    </div>
  );
};

export default ChatBox;
