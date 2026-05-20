import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChatProvider } from './context/ChatContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ChatPage from './pages/ChatPage';
import { Toaster } from 'sonner';

function App() {
  return (
    <ChatProvider>
      <Toaster position="top-center" expand={false} richColors closeButton />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/" element={<Navigate to="/chat" />} />
        </Routes>
      </Router>
    </ChatProvider>
  );
}

export default App;
