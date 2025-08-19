// App.js
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ControlPanel from "./components/ControlPanel";
import ChatWindow from "./components/ChatWindow";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const [mode, setMode] = useState("free-chat");
  const [roleplayTopic, setRoleplayTopic] = useState("At School");

  const [conversations, setConversations] = useState({
    "free-chat-en-US": [],
    "At School-en-US": [],
    "At the Store-en-US": [],
    "At Home-en-US": [],
    "free-chat-hi-IN": [],
    "At School-hi-IN": [],
    "At the Store-hi-IN": [],
    "At Home-hi-IN": [],
  });

  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const chatWindowRef = useRef(null);

  const currentConversationKey = `${
    mode === "roleplay" ? roleplayTopic : "free-chat"
  }-${language}`;
  const currentConversation = conversations[currentConversationKey] || [];

  // Auto-scroll
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [currentConversation]);

  // --- Helpers for speech synthesis ---
  const stripEmojis = (str) =>
    str.replace(
      // broad emoji ranges (no \p{Emoji} needed)
      /[\u{1F300}-\u{1FAFF}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{27BF}]/gu,
      ""
    );

  const speakText = (text, lang) => {
    try {
      if (!window.speechSynthesis) return;

      // Cancel anything already speaking
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;           // "hi-IN" or "en-US"
      utterance.rate = 0.95;          // slightly slower for clarity
      utterance.pitch = 1;

      const assignVoiceAndSpeak = () => {
        const voices = window.speechSynthesis.getVoices();

        // Try exact match first (e.g., "hi-IN")
        let voice =
          voices.find((v) => v.lang === lang) ||
          // Fallback: match on language only (e.g., "hi" or "en")
          voices.find((v) => v.lang?.startsWith(lang.split("-")[0])) ||
          // Extra fallback for Hindi by name/locale hints
          voices.find((v) => /hi|hindi|india/i.test(`${v.lang} ${v.name}`));

        if (voice) utterance.voice = voice;
        window.speechSynthesis.speak(utterance);
      };

      // Voices may not be loaded yet on first call
      if (window.speechSynthesis.getVoices().length > 0) {
        assignVoiceAndSpeak();
      } else {
        window.speechSynthesis.onvoiceschanged = assignVoiceAndSpeak;
      }
    } catch (error) {
      console.error("Speech synthesis failed:", error);
    }
  };

  // Start recording
  const handleStartRecording = async () => {
    try {
      audioChunks.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.current.push(event.data);
      };
      mediaRecorder.current.onstop = handleSendAudio;
      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  // Stop recording
  const handleStopRecording = () => {
    if (mediaRecorder.current?.state === "recording") {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setIsLoading(true);
    }
  };

  // Send audio to backend
  const handleSendAudio = async () => {
    const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
    audioChunks.current = [];

    if (audioBlob.size === 0) {
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("audio", audioBlob);
    formData.append("language", language);
    formData.append("mode", mode);
    formData.append("roleplayTopic", roleplayTopic);

    try {
      console.log("➡️ Sending to backend:", backendUrl);

      const response = await axios.post(`${backendUrl}/api/chat`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Your backend currently returns { userText, aiReply }
      const { userText, aiReply } = response.data;

      // Clean text for speech (strip emojis to avoid TTS glitches)
      const cleanTextForSpeech = stripEmojis(aiReply || "");

      setConversations((prev) => ({
        ...prev,
        [currentConversationKey]: [
          ...prev[currentConversationKey],
          { sender: "user", text: userText },
          { sender: "ai", text: aiReply },
        ],
      }));

      if (cleanTextForSpeech) speakText(cleanTextForSpeech.trim(), language);
    } catch (error) {
      if (error.response) {
        console.error("Backend error:", error.response.data);
      } else {
        console.error("Frontend error:", error.message);
      }
      alert("Sorry, something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{ fontFamily: "'Nunito', sans-serif" }}
      className="bg-amber-50 flex flex-col md:flex-row h-screen"
    >
      <ControlPanel
        language={language}
        setLanguage={setLanguage}
        mode={mode}
        setMode={setMode}
        roleplayTopic={roleplayTopic}
        setRoleplayTopic={setRoleplayTopic}
        isRecording={isRecording}
        isLoading={isLoading}
        handleStartRecording={handleStartRecording}
        handleStopRecording={handleStopRecording}
      />
      <ChatWindow
        conversation={currentConversation}
        chatWindowRef={chatWindowRef}
      />
    </div>
  );
}

export default App;
