import React from 'react';

// A simple SVG icon for our AI's avatar
const GenieAvatar = () => (
  <div className="w-10 h-10 rounded-full bg-teal-400 flex items-center justify-center text-white text-xl font-bold shadow-md flex-shrink-0">
    G
  </div>
);

function ChatMessage({ message }) {
  const { sender, text } = message;
  const isUser = sender === 'user';

  return (
    <div className={`max-w-lg flex items-start gap-3 ${isUser ? 'self-end flex-row-reverse' : 'self-start'}`}>
      {!isUser && <GenieAvatar />}
      <div className={`p-4 rounded-2xl ${isUser ? 'bg-teal-100 rounded-br-none' : 'bg-white shadow-md rounded-bl-none'}`}>
        <p className="font-bold text-sm mb-1 text-teal-700">{isUser ? 'You' : 'Genie'}</p>
        <p className="text-gray-800 break-words">{text}</p>
      </div>
    </div>
  );
}

export default ChatMessage;