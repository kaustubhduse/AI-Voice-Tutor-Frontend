import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';

function App() {
  const location = useLocation();

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }} className="bg-slate-900 text-slate-200 h-screen">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;