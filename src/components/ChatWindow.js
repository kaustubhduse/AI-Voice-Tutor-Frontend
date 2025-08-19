import React from 'react';
import ChatMessage from './ChatMessage';

function ChatWindow({ conversation, chatWindowRef }) {
  return (
    <div className="w-full md:w-3/4 p-4 sm:p-6 md:p-8 flex flex-col">
      <div
        ref={chatWindowRef}
        className="flex-grow bg-white/50 backdrop-blur-sm border-2 border-amber-200 
                   rounded-2xl p-3 sm:p-4 md:p-6 overflow-y-auto 
                   flex flex-col gap-3 sm:gap-4 md:gap-5 
                   bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+CjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2ZmZmZmZiI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMSIgZmlsbD0iI2Y1YmQ3ZSI+PC9jaXJjbGU+Cjwvc3ZnPg==')]"
      >
        {conversation.length === 0 ? (
          <div className="flex-grow flex items-center justify-center text-gray-400 text-base sm:text-lg md:text-xl text-center px-2">
            Your conversation will appear here...
          </div>
        ) : (
          conversation.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))
        )}
      </div>
    </div>
  );
}

export default ChatWindow;
