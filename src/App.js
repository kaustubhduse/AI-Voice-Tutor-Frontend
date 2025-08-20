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
    "free-chat-mr-IN": [],
    "At School-mr-IN": [],
    "free-chat-gu-IN": [],
    "At School-gu-IN": [],
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

  // Speech synthesis with language fallback
  const speakText = (text, lang) => {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      const voices = window.speechSynthesis.getVoices();
      const findVoice = (prefix) =>
        voices.find((v) => v.lang.toLowerCase().startsWith(prefix.toLowerCase()));

      if (lang === "mr-IN" || lang === "gu-IN") {
        // Try Hindi voice first (phonetically closer)
        utterance.voice = findVoice("hi") || findVoice("en");
      } else {
        utterance.voice = findVoice(lang) || findVoice("en");
      }

      utterance.lang = lang;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
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

      let { userText, aiReply } = response.data;

      if (typeof aiReply !== "string") {
        console.warn("⚠️ aiReply is not a string, received:", aiReply);
        aiReply = String(aiReply || "");
      }

      // Clean emojis for speech synthesis
      const cleanTextForSpeech = aiReply.replace(/\p{Emoji}/gu, "");

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
