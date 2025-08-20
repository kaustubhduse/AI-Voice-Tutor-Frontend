import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ControlPanel from '../components/ControlPanel';
import ChatWindow from '../components/ChatWindow';
import dotenv from 'dotenv';

dotenv.config();

function ChatPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [mode, setMode] = useState('free-chat');
  const [roleplayTopic, setRoleplayTopic] = useState('At School');
  const [conversations, setConversations] = useState({
    'free-chat-en-US': [], 'At School-en-US': [], 'At the Store-en-US': [], 'At Home-en-US': [],
    'free-chat-hi-IN': [], 'At School-hi-IN': [], 'At the Store-hi-IN': [], 'At Home-hi-IN': [],
  });

  const mediaRecorder = useRef(null);
  const audioChunks = useRef(null);
  const chatWindowRef = useRef(null);

  const currentConversationKey = `${mode === 'roleplay' ? roleplayTopic : 'free-chat'}-${language}`;
  const currentConversation = conversations[currentConversationKey] || [];

  // This effect scrolls the chat window
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [currentConversation]);

  // NEW FEATURE: This effect starts the roleplay conversation
  useEffect(() => {
    const initiateRoleplay = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post('http://localhost:3001/initiate', {
          language,
          mode,
          roleplayTopic,
        });

        const { aiReply } = response.data;
        if (aiReply) {
          const emojiRegex = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;
          const cleanTextForSpeech = aiReply.replace(emojiRegex, '');

          setConversations(prev => ({
            ...prev,
            [currentConversationKey]: [{ sender: 'ai', text: aiReply }],
          }));
          
          if (cleanTextForSpeech) {
            speakText(cleanTextForSpeech.trim(), language);
          }
        }
      } catch (error) {
        console.error("Failed to initiate roleplay:", error);
        alert("Sorry, couldn't start the conversation.");
      } finally {
        setIsLoading(false);
      }
    };

    // Trigger the initiation if mode is 'roleplay' and the chat for that role is empty
    if (mode === 'roleplay' && currentConversation.length === 0) {
      initiateRoleplay();
    }
  }, [currentConversationKey]); // This re-runs every time you switch roles/languages

  const speakText = (text, lang) => {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Browser speech synthesis failed:", error);
    }
  };

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
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setIsLoading(true);
    }
  };

  const handleSendAudio = async () => {
    const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
    audioChunks.current = [];
    if (audioBlob.size === 0) {
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('language', language);
    formData.append('mode', mode);
    formData.append('roleplayTopic', roleplayTopic);
    formData.append('history', JSON.stringify(currentConversation));

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/chat`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { userText, aiReply } = response.data;
      const emojiRegex = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;
      const cleanTextForSpeech = aiReply.replace(emojiRegex, '');
      
      setConversations(prev => ({
        ...prev,
        [currentConversationKey]: [
          ...prev[currentConversationKey],
          { sender: 'user', text: userText },
          { sender: 'ai', text: aiReply },
        ],
      }));

      if (cleanTextForSpeech) {
        speakText(cleanTextForSpeech.trim(), language);
      }
    } catch (error) {
      console.error('Error sending audio to backend:', error);
      alert('Sorry, something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      <ControlPanel 
        language={language} setLanguage={setLanguage}
        mode={mode} setMode={setMode}
        roleplayTopic={roleplayTopic} setRoleplayTopic={setRoleplayTopic}
        isRecording={isRecording} isLoading={isLoading}
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

export default ChatPage;