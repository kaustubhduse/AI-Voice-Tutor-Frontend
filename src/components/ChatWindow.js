import React from 'react';
import ChatMessage from './ChatMessage';

function ChatWindow({ conversation, chatWindowRef }) {
  return (
    <div className="w-full md:w-3/4 p-4 sm:p-6 md:p-8 flex flex-col">
      <div ref={chatWindowRef} className="flex-grow bg-slate-800/30 border-2 border-slate-700 rounded-2xl p-6 overflow-y-auto flex flex-col gap-5">
        {conversation.length === 0 ? (
          <div className="flex-grow flex items-center justify-center text-slate-500 text-xl text-center">
            Tap the microphone to start your conversation...
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