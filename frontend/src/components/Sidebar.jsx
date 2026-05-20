import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../api';
import { useChat } from '../context/ChatContext';
import { Search, LogOut, Moon, Sun, MessageSquare, Settings, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout, selectedChat, setSelectedChat, onlineUsers } = useChat();
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const getUsers = async () => {
      try {
        const { data } = await fetchUsers();
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    };
    getUsers();
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setDarkMode(!darkMode);
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 shadow-sm relative z-20">
      {/* User Profile Header */}
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
              <img 
                src={user.avatar} 
                alt={user.username} 
                className="relative w-14 h-14 rounded-2xl border-2 border-white dark:border-slate-900 object-cover shadow-xl" 
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full shadow-lg"></div>
            </div>
            <div>
              <h2 className="font-black text-slate-900 dark:text-white leading-none text-xl tracking-tight">{user.username}</h2>
              <p className="text-xs text-green-500 font-bold uppercase tracking-widest mt-1">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={toggleDarkMode} 
              className="p-3 text-slate-500 hover:text-primary-500 hover:bg-primary-500/10 rounded-2xl transition-all active:scale-90"
              title="Toggle Theme"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={logout} 
              className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all active:scale-90"
              title="Sign Out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group mb-4">
          <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-2xl transition-all group-focus-within:ring-2 group-focus-within:ring-primary-500/20" />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search conversations..."
            className="relative w-full pl-11 pr-4 py-4 bg-transparent border-none rounded-2xl outline-none dark:text-white text-sm font-medium placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs / Labels */}
      <div className="px-6 py-2 flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">All Messages</span>
        <div className="h-[1px] flex-grow mx-4 bg-slate-100 dark:bg-slate-800" />
        <span className="bg-primary-500/10 text-primary-600 dark:text-primary-400 text-[10px] font-black px-2.5 py-1 rounded-lg">
          {filteredUsers.length}
        </span>
      </div>

      {/* User List */}
      <div className="flex-grow overflow-y-auto custom-scrollbar px-3 py-4">
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u, index) => (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.03 }}
                  key={u._id}
                  onClick={() => setSelectedChat(u)}
                  className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all duration-300 group relative overflow-hidden ${
                    selectedChat?._id === u._id 
                      ? 'bg-primary-600 shadow-2xl shadow-primary-600/40 text-white translate-x-1' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {selectedChat?._id === u._id && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute left-0 top-0 bottom-0 w-1.5 bg-white/40"
                    />
                  )}
                  
                  <div className="relative flex-shrink-0">
                    <img 
                      src={u.avatar} 
                      alt={u.username} 
                      className={`w-14 h-14 rounded-2xl object-cover border-2 transition-all duration-300 ${
                        selectedChat?._id === u._id ? 'border-white/30 scale-110 shadow-lg' : 'border-transparent dark:border-slate-800'
                      }`} 
                    />
                    {onlineUsers.includes(u._id) && (
                      <div className={`absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-green-500 border-[3px] rounded-full shadow-lg ${
                        selectedChat?._id === u._id ? 'border-primary-600' : 'border-white dark:border-slate-900'
                      }`}></div>
                    )}
                  </div>

                  <div className="flex-grow text-left min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className={`font-black truncate text-base tracking-tight ${
                        selectedChat?._id === u._id ? 'text-white' : 'text-slate-900 dark:text-white'
                      }`}>
                        {u.username}
                      </h3>
                      <span className={`text-[10px] font-bold opacity-60 ${
                        selectedChat?._id === u._id ? 'text-white' : 'text-slate-500'
                      }`}>
                        12:45
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <p className={`text-xs truncate font-bold ${
                        selectedChat?._id === u._id ? 'text-primary-100' : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {onlineUsers.includes(u._id) ? 'Available for chat' : 'Currently offline'}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-center px-6">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] flex items-center justify-center mb-6 opacity-50 border border-slate-100 dark:border-slate-800">
                  <MessageSquare size={36} className="text-slate-300" />
                </div>
                <p className="text-base font-black text-slate-900 dark:text-white mb-1">No one found</p>
                <p className="text-xs font-bold opacity-50 uppercase tracking-widest">Try another name</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer / Settings Quick Access */}
      <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
        <button className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-all group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 group-hover:text-primary-500 transition-colors">
              <Settings size={18} />
            </div>
            <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Settings</span>
          </div>
          <MoreHorizontal size={18} className="text-slate-300" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
