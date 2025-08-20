import React from 'react';
import { motion } from 'framer-motion';

const GenieAvatar = () => (
  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-violet-500 flex items-center justify-center text-white text-xl font-bold shadow-lg flex-shrink-0">
    G
  </div>
);

function ChatMessage({ message, isSpeaking, highlightedWordIndex, language }) {
  const { sender, text } = message;
  const isUser = sender === "user";
  const words = text.split(/[\s,]+/);
  const canHighlightWords = language === 'en-US';

  return (
    <motion.div
      className={`max-w-lg flex items-start gap-3 w-full ${isUser ? "self-end flex-row-reverse" : "self-start"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 150 }}
    >
      {!isUser && <GenieAvatar />}
      
      <div 
        className={`p-4 rounded-2xl shadow-md transition-shadow duration-300 text-white
                   ${isUser 
                     ? "bg-gradient-to-br from-violet-800 to-purple-800 rounded-br-none" 
                     : "bg-gradient-to-br from-cyan-800 to-sky-800 rounded-bl-none"} 
                   ${(isSpeaking && !canHighlightWords) ? 'shadow-cyan-400/50 shadow-lg' : ''}`}
      >
        <p className={`font-bold text-sm mb-1 ${isUser ? 'text-violet-300' : 'text-cyan-300'}`}>
          {isUser ? "You" : "Genie"}
        </p>
        <p className="text-slate-100 break-words">
          {words.map((word, index) => (
            <span
              key={index}
              className={(isSpeaking && canHighlightWords && highlightedWordIndex === index) ? 'bg-cyan-400 text-slate-900 rounded' : 'bg-transparent'}
            >
              {word}{' '}
            </span>
          ))}
        </p>
      </div>
    </motion.div>
  );
}

export default ChatMessage;