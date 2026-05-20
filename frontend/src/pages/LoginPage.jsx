import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signIn } from '../api';
import { useChat } from '../context/ChatContext';
import { LogIn, User, Lock, Loader2, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useChat();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await signIn(formData);
      login(data);
      toast.success(`Welcome back, ${data.username}!`);
      navigate('/chat');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center bg-[#f8fafc] dark:bg-[#020617] p-4 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-500/20 rounded-full blur-[120px] animate-blob" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-pink-500/10 rounded-full blur-[120px] animate-blob animation-delay-4000" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full z-10"
      >
        <div className="glass-card rounded-[2.5rem] p-8 md:p-12">
          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0.5, rotate: -15 }}
              animate={{ scale: 1, rotate: 3 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-tr from-primary-600 to-indigo-600 rounded-3xl shadow-2xl shadow-primary-500/40 mb-8"
            >
              <MessageCircle size={48} className="text-white -rotate-3" />
            </motion.div>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Nova Chat</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Your universe, connected.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400 ml-2 uppercase tracking-wider">Username</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-primary-500/5 rounded-2xl blur-md group-focus-within:bg-primary-500/10 transition-all duration-300" />
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                  <input
                    type="text"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 outline-none transition-all dark:text-white text-base font-medium placeholder:text-slate-400"
                    placeholder="Enter your username"
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-2">
                <label className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Password</label>
                <Link to="#" className="text-xs text-primary-600 hover:text-primary-500 font-black tracking-wide">FORGOT?</Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-primary-500/5 rounded-2xl blur-md group-focus-within:bg-primary-500/10 transition-all duration-300" />
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                  <input
                    type="password"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 outline-none transition-all dark:text-white text-base font-medium placeholder:text-slate-400"
                    placeholder="••••••••"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-2xl shadow-primary-500/40 active:scale-[0.97] disabled:opacity-70 text-lg uppercase tracking-widest"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : (
                <>
                  <LogIn size={22} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              New to Nova? {' '}
              <Link to="/signup" className="text-primary-600 hover:text-primary-500 font-black decoration-2 underline-offset-4 hover:underline transition-all">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
