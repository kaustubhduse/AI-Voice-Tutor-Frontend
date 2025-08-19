import React from 'react';
import SpeakButton from './SpeakButton';

function ControlPanel(props) {
  const {
    language, setLanguage,
    mode, setMode,
    roleplayTopic, setRoleplayTopic,
    isRecording, isLoading,
    handleStartRecording, handleStopRecording
  } = props;

  return (
    <div className="w-full md:w-1/4 bg-white shadow-2xl p-4 md:p-6 flex flex-col md:items-center justify-between border-b-4 md:border-b-0 md:border-r-4 border-amber-200">
      <div className="w-full">
        {/* App Title */}
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-6 md:mb-10 text-center">
          SpeakGenie
        </h1>

        {/* Dropdowns */}
        <div className="space-y-3 md:space-y-4 text-base md:text-lg">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
          >
            <option value="en-US">English</option>
            <option value="hi-IN">Hindi (हिन्दी)</option>
          </select>

          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
          >
            <option value="free-chat">Free Chat</option>
            <option value="roleplay">Roleplay</option>
          </select>

          {mode === 'roleplay' && (
            <select
              value={roleplayTopic}
              onChange={(e) => setRoleplayTopic(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
            >
              <option value="At School">🏫 At School</option>
              <option value="At the Store">🛒 At the Store</option>
              <option value="At Home">👨‍👩‍👧 At Home</option>
            </select>
          )}
        </div>
      </div>

      {/* Mic Button */}
      <div className="mt-6 md:mt-0 flex justify-center">
        <SpeakButton
          isRecording={isRecording}
          isLoading={isLoading}
          handleStartRecording={handleStartRecording}
          handleStopRecording={handleStopRecording}
        />
      </div>
    </div>
  );
}

export default ControlPanel;
