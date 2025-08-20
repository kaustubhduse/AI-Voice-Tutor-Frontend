import React from 'react';

const GenieAvatar = () => (
  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-violet-500 flex items-center justify-center text-white text-xl font-bold shadow-lg flex-shrink-0">
    G
  </div>
);

function ChatMessage({ message }) {
  const { sender, text } = message;
  const isUser = sender === "user";

  return (
    <div className={`flex items-start gap-3 w-full ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <GenieAvatar />}
      <div className={`max-w-[70%] p-4 rounded-2xl shadow-md ${isUser ? "bg-pink-800/50 rounded-br-none" : "bg-slate-700/50 rounded-bl-none"}`}>
        <p className={`font-bold text-sm mb-1 ${isUser ? 'text-pink-300' : 'text-cyan-300'}`}>
          {isUser ? "You" : "Genie"}
        </p>
        <p className="text-slate-200 break-words">{text}</p>
      </div>
    </div>
  );
}

export default ChatMessage;