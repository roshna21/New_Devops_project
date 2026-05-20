import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { fetchMessages, sendMessage as sendMessageApi } from '../api';
import { Send, Phone, Video, MoreVertical, ChevronLeft, Smile, Paperclip, Info, Image as ImageIcon, Check, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWindow = () => {
  const { selectedChat, setSelectedChat, user, socket, onlineUsers, typingStatus } = useChat();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef();

  const showTypingIndicator = selectedChat && typingStatus[selectedChat._id];

  useEffect(() => {
    if (!selectedChat) return;

    const getMessages = async () => {
      setLoading(true);
      try {
        const { data } = await fetchMessages(selectedChat._id);
        setMessages(data);
        if (socket) {
          socket.emit('join-chat', selectedChat._id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, [selectedChat, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (msg) => {
      if (selectedChat && selectedChat._id === msg.senderId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on('message-received', handleMessageReceived);

    return () => {
      socket.off('message-received', handleMessageReceived);
    };
  }, [socket, selectedChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showTypingIndicator]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (socket) {
      socket.emit('stop-typing', selectedChat._id);
    }

    try {
      const { data } = await sendMessageApi({
        receiverId: selectedChat._id,
        message: newMessage
      });
      
      if (socket) {
        socket.emit('new-message', data);
      }
      
      setMessages((prev) => [...prev, data]);
      setNewMessage('');
      setIsTyping(false);
    } catch (err) {
      console.error(err);
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socket) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && isTyping) {
        socket.emit('stop-typing', selectedChat._id);
        setIsTyping(false);
      }
    }, timerLength);
  };

  if (!selectedChat) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center bg-white dark:bg-slate-950 p-8 text-center relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
          className="z-10"
        >
          <div className="w-32 h-32 bg-gradient-to-tr from-primary-600 to-indigo-600 rounded-[2.5rem] flex items-center justify-center mb-10 mx-auto shadow-2xl shadow-primary-500/30 rotate-12 group hover:rotate-0 transition-transform duration-500">
            <Send size={56} className="text-white -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
          </div>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">Nova Chat</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-xl font-medium leading-relaxed">
            Select a conversation to start messaging in real-time.
          </p>
          <div className="mt-12 flex items-center justify-center gap-6 opacity-40">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center"><CheckCheck size={24} /></div>
              <span className="text-[10px] font-black uppercase tracking-widest">Secure</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center"><Video size={24} /></div>
              <span className="text-[10px] font-black uppercase tracking-widest">Realtime</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const isOnline = onlineUsers.includes(selectedChat._id);

  return (
    <div className="flex flex-col w-full h-full bg-[#f8fafc] dark:bg-slate-950 relative">
      {/* Decorative background blobs */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-primary-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="px-6 py-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/50 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedChat(null)} 
            className="md:hidden p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all active:scale-90"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-indigo-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
            <img 
              src={selectedChat.avatar} 
              alt={selectedChat.username} 
              className="relative w-12 h-12 rounded-xl object-cover border-2 border-white dark:border-slate-800 shadow-md" 
            />
            {isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full shadow-lg"></div>
            )}
          </div>
          <div>
            <h3 className="font-black text-slate-900 dark:text-white leading-none text-xl tracking-tight mb-1">{selectedChat.username}</h3>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em]">
                {showTypingIndicator ? 'Typing...' : (isOnline ? 'Online now' : 'Offline')}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button className="hidden sm:flex p-3 text-slate-400 hover:text-primary-500 hover:bg-primary-500/10 rounded-2xl transition-all active:scale-90"><Phone size={20} /></button>
          <button className="hidden sm:flex p-3 text-slate-400 hover:text-primary-500 hover:bg-primary-500/10 rounded-2xl transition-all active:scale-90"><Video size={20} /></button>
          <button className="p-3 text-slate-400 hover:text-primary-500 hover:bg-primary-500/10 rounded-2xl transition-all active:scale-90"><Info size={20} /></button>
          <button className="p-3 text-slate-400 hover:text-primary-500 hover:bg-primary-500/10 rounded-2xl transition-all active:scale-90"><MoreVertical size={20} /></button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto px-4 sm:px-8 py-10 space-y-8 custom-scrollbar relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-6">
            <div className="w-12 h-12 border-[5px] border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Decrypting Messages...</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => {
              const isMe = msg.senderId === user._id;
              const showAvatar = index === 0 || messages[index - 1].senderId !== msg.senderId;
              
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  key={msg._id || index} 
                  className={`flex items-end gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMe && showAvatar && (
                    <img src={selectedChat.avatar} className="w-9 h-9 rounded-xl mb-1 hidden sm:block shadow-lg border-2 border-white dark:border-slate-800" alt="" />
                  )}
                  {!isMe && !showAvatar && <div className="w-9 hidden sm:block" />}
                  
                  <div className={`group relative max-w-[85%] sm:max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`px-5 py-4 rounded-3xl shadow-md relative message-appear ${
                      isMe 
                        ? 'bg-primary-600 text-white rounded-br-none message-bubble-me' 
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none border border-slate-100 dark:border-slate-700/50 message-bubble-them'
                    }`}>
                      <p className="text-[15px] leading-relaxed font-semibold whitespace-pre-wrap break-words">{msg.message}</p>
                      <div className={`text-[9px] mt-2 flex items-center gap-1.5 font-black uppercase tracking-wider opacity-60 ${isMe ? 'text-primary-100' : 'text-slate-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {isMe && <CheckCheck size={12} className="text-primary-200" />}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        {showTypingIndicator && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start items-center gap-3">
            <img src={selectedChat.avatar} className="w-9 h-9 rounded-xl hidden sm:block shadow-md" alt="" />
            <div className="bg-white dark:bg-slate-800 px-5 py-4 rounded-[1.5rem] rounded-bl-none shadow-sm border border-slate-100 dark:border-slate-700/50">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={scrollRef}></div>
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800/50 z-20">
        <form onSubmit={handleSendMessage} className="max-w-6xl mx-auto flex items-center gap-3 sm:gap-4">
          <div className="flex items-center">
            <button type="button" className="p-3.5 text-slate-400 hover:text-primary-500 hover:bg-primary-500/10 rounded-2xl transition-all active:scale-90">
              <Paperclip size={24} />
            </button>
            <button type="button" className="p-3.5 text-slate-400 hover:text-primary-500 hover:bg-primary-500/10 rounded-2xl transition-all active:scale-90 hidden sm:block">
              <ImageIcon size={24} />
            </button>
          </div>
          <div className="relative flex-grow group">
            <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-[1.5rem] transition-all group-focus-within:ring-2 group-focus-within:ring-primary-500/20" />
            <input
              type="text"
              placeholder={`Message ${selectedChat.username}...`}
              className="relative w-full pl-6 pr-14 py-4.5 bg-transparent border-none outline-none dark:text-white text-base font-bold placeholder:text-slate-400 placeholder:font-bold"
              value={newMessage}
              onChange={typingHandler}
            />
            <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-primary-500 transition-colors active:scale-90">
              <Smile size={24} />
            </button>
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-tr from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white rounded-[1.5rem] flex items-center justify-center transition-all shadow-xl shadow-primary-500/30 active:scale-90 flex-shrink-0 group"
          >
            <Send size={28} className={`transition-transform duration-300 ${newMessage.trim() ? 'translate-x-0.5 -translate-y-0.5 group-hover:scale-110' : 'opacity-50'}`} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
