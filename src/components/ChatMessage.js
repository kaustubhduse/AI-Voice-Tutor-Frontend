import React from "react";

const GenieAvatar = () => (
  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-teal-400 flex items-center justify-center text-white text-base sm:text-xl font-bold shadow-md flex-shrink-0">
    G
  </div>
);

function ChatMessage({ message }) {
  const { sender, text } = message;
  const isUser = sender === "user";

  return (
    <div
      className={`flex items-start gap-2 sm:gap-3 w-full ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && <GenieAvatar />}

      <div
        className={`max-w-[80%] sm:max-w-[70%] md:max-w-[60%] lg:max-w-[50%] 
          px-3 sm:px-4 py-2 sm:py-3 rounded-2xl 
          ${isUser ? "bg-teal-100 rounded-br-none" : "bg-white shadow-md rounded-bl-none"}`}
      >
        <p className="font-bold text-xs sm:text-sm mb-1 text-teal-700">
          {isUser ? "You" : "Genie"}
        </p>
        <p className="text-gray-800 text-sm sm:text-base break-words">
          {text}
        </p>
      </div>
    </div>
  );
}

export default ChatMessage;
