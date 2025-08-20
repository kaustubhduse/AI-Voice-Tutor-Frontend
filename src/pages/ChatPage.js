import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { AnimatePresence } from "framer-motion";
import ControlPanel from "../components/ControlPanel";
import ChatWindow from "../components/ChatWindow";
import SpeakButton from "../components/SpeakButton";

const HamburgerButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="md:hidden fixed top-5 right-5 z-20 bg-slate-800/50 p-2 rounded-md text-white backdrop-blur-sm"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  </button>
);

function ChatPage() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
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

  const [speakingMessageIndex, setSpeakingMessageIndex] = useState(null);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState(null);

  const mediaRecorder = useRef(null);
  const audioChunks = useRef(null);
  const chatWindowRef = useRef(null);

  const currentConversationKey = `${
    mode === "roleplay" ? roleplayTopic : "free-chat"
  }-${language}`;
  const currentConversation = conversations[currentConversationKey] || [];

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [currentConversation]);

  const speakText = (message, messageIndex, lang) => {
    try {
      window.speechSynthesis.cancel();
      setSpeakingMessageIndex(messageIndex);
      setHighlightedWordIndex(0);

      const emojiRegex =
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;
      const cleanText = message.text.replace(emojiRegex, "").trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = lang;
      utterance.rate = 0.9;

      let wordIndex = 0;
      utterance.onboundary = (event) => {
        if (event.name === "word") {
          setHighlightedWordIndex(wordIndex);
          wordIndex++;
        }
      };

      utterance.onend = () => {
        setSpeakingMessageIndex(null);
        setHighlightedWordIndex(null);
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Browser speech synthesis failed:", error);
      setSpeakingMessageIndex(null);
      setHighlightedWordIndex(null);
    }
  };

  useEffect(() => {
    const initiateRoleplay = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/initiate`,
          { language, mode, roleplayTopic }
        );
        const { aiReply } = response.data;
        if (aiReply) {
          const newMessage = { sender: "ai", text: aiReply };
          setConversations((prev) => ({
            ...prev,
            [currentConversationKey]: [newMessage],
          }));
          speakText(newMessage, 0, language);
        }
      } catch (error) {
        console.error("Failed to initiate roleplay:", error);
        alert("Sorry, couldn't start the conversation.");
      } finally {
        setIsLoading(false);
      }
    };
    if (mode === "roleplay" && currentConversation.length === 0) {
      initiateRoleplay();
    }
  }, [currentConversationKey]);

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

  const handleStopRecording = () => {
    if (mediaRecorder.current?.state === "recording") {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setIsLoading(true);
    }
  };

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
    formData.append("history", JSON.stringify(currentConversation));
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/chat`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const { userText, aiReply } = response.data;

      const newUserMessage = { sender: "user", text: userText };
      const newAiMessage = { sender: "ai", text: aiReply };

      setConversations((prev) => ({
        ...prev,
        [currentConversationKey]: [
          ...prev[currentConversationKey],
          newUserMessage,
          newAiMessage,
        ],
      }));

      const nextMessageIndex = currentConversation.length + 1;
      speakText(newAiMessage, nextMessageIndex, language);
    } catch (error) {
      console.error("Error sending audio to backend:", error);
      alert("Sorry, something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full relative">
      <HamburgerButton onClick={() => setIsPanelOpen(true)} />

      <AnimatePresence>
        {isPanelOpen && (
          <div
            onClick={() => setIsPanelOpen(false)}
            className="md:hidden fixed inset-0 bg-black/50 z-30"
          ></div>
        )}
      </AnimatePresence>

      <ControlPanel
        isOpen={isPanelOpen}
        setIsOpen={setIsPanelOpen}
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
        speakingMessageIndex={speakingMessageIndex}
        highlightedWordIndex={highlightedWordIndex}
        language={language}
      />

      <div className="md:hidden fixed bottom-5 left-5 z-20">
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

export default ChatPage;
