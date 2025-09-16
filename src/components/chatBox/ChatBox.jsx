import React, { useState, useEffect, useMemo, useRef } from "react";
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
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const isNearBottomRef = useRef(true);
  const hasLoadedMessagesRef = useRef(false);
  const lastMessageCountRef = useRef(0);
  const isSendingRef = useRef(false);

  const getChatId = () => {
    if (!selectedChat || !currentUser) return null;
    return [currentUser.email.toLowerCase(), selectedChat.id.toLowerCase()]
      .sort()
      .join("-");
  };

  const chatId = useMemo(getChatId, [selectedChat, currentUser]);

  const checkIsNearBottom = () => {
    if (!chatContainerRef.current) return false;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight <= 150;
    return isNearBottom;
  };

  useEffect(() => {
    if (
      messages.length > lastMessageCountRef.current &&
      isNearBottomRef.current &&
      !isSendingRef.current
    ) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    lastMessageCountRef.current = messages.length;
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      isNearBottomRef.current = checkIsNearBottom();
    };

    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [chatId]);

  useEffect(() => {
    if (!currentUser || !selectedChat) {
      setMessages([]);
      isNearBottomRef.current = true;
      hasLoadedMessagesRef.current = false;
      lastMessageCountRef.current = 0;
      isSendingRef.current = false;
      return;
    }

    const handleMessage = ({
      chatId: incomingChatId,
      messages: incomingMessages,
      unreadCounts,
    }) => {
      if (incomingChatId.toLowerCase() === chatId?.toLowerCase()) {
        setMessages(incomingMessages || []);
        if (
          incomingMessages[incomingMessages.length - 1]?.sender !==
          currentUser.email.toLowerCase()
        ) {
          isNearBottomRef.current = checkIsNearBottom();
        }
      }
    };

    const handleChatLoaded = ({
      chatId: incomingChatId,
      messages: loadedMessages,
    }) => {
      if (incomingChatId.toLowerCase() === chatId?.toLowerCase()) {
        setMessages(loadedMessages || []);
        hasLoadedMessagesRef.current = true;
        isNearBottomRef.current = true;
        lastMessageCountRef.current = loadedMessages?.length || 0;
      }
    };

    socket.on("connect", () => {
      socket.emit("login", currentUser.email.toLowerCase());
      if (chatId) {
        socket.emit("loadMessages", {
          chatId,
          userEmail: currentUser.email.toLowerCase(),
        });
      }
    });

    socket.on("reconnect", (attempt) => {
      socket.emit("login", currentUser.email.toLowerCase());
      if (chatId && !hasLoadedMessagesRef.current) {
        socket.emit("loadMessages", {
          chatId,
          userEmail: currentUser.email.toLowerCase(),
        });
      }
    });

    socket.on("message", handleMessage);
    socket.on("chatLoaded", handleChatLoaded);

    socket.on("connect_error", (error) => {});

    if (chatId && !hasLoadedMessagesRef.current) {
      const timer = setInterval(() => {
        if (socket.connected) {
          socket.emit("loadMessages", {
            chatId,
            userEmail: currentUser.email.toLowerCase(),
          });
        }
      }, 500);
      return () => clearInterval(timer);
    }

    return () => {
      socket.off("message", handleMessage);
      socket.off("chatLoaded", handleChatLoaded);
      socket.off("connect");
      socket.off("reconnect");
      socket.off("connect_error");
    };
  }, [chatId, currentUser]);

  const handleSend = ({ text, image }) => {
    if (!selectedChat || !currentUser) return;
    isSendingRef.current = true;
    socket.emit("sendMessage", {
      sender: currentUser.email.toLowerCase(),
      recipient: selectedChat.id.toLowerCase(),
      text,
      image: image || null,
    });
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      isSendingRef.current = false;
    }, 0);
  };

  return (
    <div className="h-screen w-4/5 flex flex-col">
      <ChatHeader selectedChat={selectedChat} />
      <div
        ref={chatContainerRef}
        className="flex-1 p-4 overflow-y-auto text-gray-700 space-y-4"
      >
        <ChatMessages
          selectedChat={selectedChat}
          messages={messages}
          currentUserEmail={currentUser?.email}
        />
        <div ref={messagesEndRef} />
      </div>
      {selectedChat && currentUser && <ChatInput onSend={handleSend} />}
    </div>
  );
};

export default ChatBox;
