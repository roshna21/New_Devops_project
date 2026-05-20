import React, { useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ChatPage = () => {
  const { user, selectedChat } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="flex h-screen h-[100dvh] bg-slate-50 dark:bg-[#020617] overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex w-full h-full relative z-10 overflow-hidden">
        {/* Sidebar - Persistent on desktop, toggles on mobile */}
        <motion.div 
          initial={false}
          animate={{ 
            x: selectedChat && window.innerWidth < 768 ? '-100%' : '0%',
            opacity: selectedChat && window.innerWidth < 768 ? 0 : 1
          }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className={`
            absolute inset-0 z-40 md:relative md:inset-auto
            w-full md:w-80 lg:w-96 flex-shrink-0 
            border-r border-slate-200 dark:border-slate-800
            bg-white dark:bg-slate-900
          `}
        >
          <Sidebar />
        </motion.div>

        {/* Chat Window - Persistent on desktop, toggles on mobile */}
        <motion.div 
          initial={false}
          animate={{ 
            x: !selectedChat && window.innerWidth < 768 ? '100%' : '0%',
            opacity: !selectedChat && window.innerWidth < 768 ? 0 : 1
          }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className={`
            absolute inset-0 z-50 md:relative md:inset-auto
            flex-grow bg-white dark:bg-slate-900/50 backdrop-blur-sm
            ${!selectedChat ? 'pointer-events-none md:pointer-events-auto' : 'pointer-events-auto'}
          `}
        >
          <ChatWindow />
        </motion.div>
      </div>
    </div>
  );
};

export default ChatPage;
