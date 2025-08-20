import React from 'react';
import { motion } from 'framer-motion';

const MicrophoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 10-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
  </svg>
);

function SpeakButton({ isRecording, isLoading, handleStartRecording, handleStopRecording }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center h-32 w-32">
        <motion.button
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          className={`w-28 h-28 rounded-full font-bold text-white shadow-lg flex items-center justify-center disabled:bg-slate-600 disabled:cursor-not-allowed ${
            isRecording ? 'bg-pink-500 shadow-pink-500/50' : 'bg-cyan-500 shadow-cyan-500/50'
          }`}
          disabled={isLoading}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {isRecording ? 
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
              <MicrophoneIcon />
            </motion.div>
            : <MicrophoneIcon />
          }
        </motion.button>
        {isLoading && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-32 h-32 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      <p className="mt-4 text-slate-400 text-center font-semibold">
        {isLoading ? 'Genie is thinking...' : (isRecording ? 'Listening...' : 'Tap the mic to speak')}
      </p>
    </div>
  );
}

export default SpeakButton;