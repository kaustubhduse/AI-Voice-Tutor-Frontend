import React from 'react';

// Responsive SVG icon for microphone
const MicrophoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 10-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
      clipRule="evenodd"
    />
  </svg>
);

function SpeakButton({ isRecording, isLoading, handleStartRecording, handleStopRecording }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32">
        <button
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full font-bold text-white shadow-xl transition-all transform hover:scale-110 disabled:bg-gray-400 flex items-center justify-center ${
            isRecording ? 'bg-orange-500 animate-pulse' : 'bg-teal-500'
          }`}
          disabled={isLoading}
        >
          <MicrophoneIcon />
        </button>
        {isLoading && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      <p className="mt-4 text-gray-500 text-center font-semibold text-sm sm:text-base md:text-lg">
        {isLoading ? 'Genie is thinking...' : isRecording ? 'Listening...' : 'Tap the mic to speak'}
      </p>
    </div>
  );
}

export default SpeakButton;
