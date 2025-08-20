import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Simple SVG icons for the guidelines
const SelectIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>;
const MicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-14 0m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>;
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;

function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-full text-center p-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-pink-500 to-violet-500 bg-clip-text text-transparent pb-4">
          SpeakGenie
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mt-4 mb-12">
          Your friendly AI-powered tutor to master new languages through conversation.
        </motion.p>
        
        <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          <div className="bg-slate-800/50 p-6 rounded-2xl flex flex-col items-center">
            <div className="bg-cyan-500/20 text-cyan-400 rounded-full p-3 mb-4"><SelectIcon /></div>
            <h2 className="text-xl font-bold mb-2">Choose a Mode</h2>
            <p className="text-slate-400">Select a language and a fun roleplay scenario to practice real-life conversations.</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-2xl flex flex-col items-center">
            <div className="bg-pink-500/20 text-pink-400 rounded-full p-3 mb-4"><MicIcon /></div>
            <h2 className="text-xl font-bold mb-2">Tap and Speak</h2>
            <p className="text-slate-400">Press the microphone button, speak clearly, and press it again when you're finished.</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-2xl flex flex-col items-center">
            <div className="bg-violet-500/20 text-violet-400 rounded-full p-3 mb-4"><ChatIcon /></div>
            <h2 className="text-xl font-bold mb-2">Learn & Repeat</h2>
            <p className="text-slate-400">Read and listen to Genie's response. Practice your pronunciation by speaking along!</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link to="/chat">
            <motion.button
              className="text-2xl font-bold text-white bg-gradient-to-r from-pink-500 to-violet-500 py-4 px-10 rounded-full shadow-lg shadow-violet-500/30"
              whileHover={{ scale: 1.1, boxShadow: '0 0 25px rgba(139, 92, 246, 0.5)' }}
              whileTap={{ scale: 0.9 }}
            >
              Start Chatting
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default HomePage;