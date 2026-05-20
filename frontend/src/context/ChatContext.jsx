import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'sonner';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingStatus, setTypingStatus] = useState({}); // userId -> boolean
  const [socket, setSocket] = useState(null);
  const selectedChatRef = useRef(null);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    if (user) {
      const newSocket = io(); // Uses relative path, handled by Vite proxy
      setSocket(newSocket);
      
      newSocket.emit('setup', user);
      
      newSocket.on('get-online-users', (users) => {
        setOnlineUsers(users);
      });

      newSocket.on('typing', (userId) => {
        setTypingStatus(prev => ({ ...prev, [userId]: true }));
      });

      newSocket.on('stop-typing', (userId) => {
        setTypingStatus(prev => ({ ...prev, [userId]: false }));
      });

      newSocket.on('message-received', (msg) => {
        if (!selectedChatRef.current || selectedChatRef.current._id !== msg.senderId) {
          toast.info(`New message from ${msg.senderName || 'someone'}`, {
            description: msg.message.length > 50 ? msg.message.substring(0, 50) + '...' : msg.message,
            action: {
              label: 'View',
              onClick: () => {
                // Future: navigate to chat
              }
            }
          });
        }
      });

      return () => {
        newSocket.disconnect();
      };
    } else {
      setSocket(null);
    }
  }, [user]);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setSelectedChat(null);
  };

  return (
    <ChatContext.Provider value={{ 
      user, setUser, login, logout, 
      selectedChat, setSelectedChat, 
      onlineUsers, typingStatus, socket 
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
