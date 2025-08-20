import React from 'react';
import ChatMessage from './ChatMessage';

function ChatWindow({ conversation, chatWindowRef, speakingMessageIndex, highlightedWordIndex, language }) {
  return (
    <div className="w-full md:w-3/4 p-4 sm:p-6 md:p-8 flex flex-col">
      {/* v-- THIS IS THE CORRECTED LINE --v */}
      <div 
        ref={chatWindowRef} 
        className="flex-grow bg-slate-800/30 rounded-2xl p-3 sm:p-6 overflow-y-auto flex flex-col gap-4 shadow-inner"
      >
        {conversation.length === 0 ? (
          <div className="flex-grow flex items-center justify-center text-slate-500 text-lg md:text-xl text-center">
            Your conversation will appear here...
          </div>
        ) : (
          conversation.map((msg, index) => (
            <ChatMessage 
              key={index} 
              message={msg}
              isSpeaking={speakingMessageIndex === index}
              highlightedWordIndex={speakingMessageIndex === index ? highlightedWordIndex : null}
              language={language}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ChatWindow;