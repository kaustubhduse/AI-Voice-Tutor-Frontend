# AI Voice Tutor Frontend

This is the **frontend React application** for the AI Voice Tutor project. It allows users (children) to interact with an AI English tutor using **voice**. The AI can chat freely or roleplay scenarios like **At School, At Home, or At the Store**. Users can also select the language for conversation.

---

## **Features**

* Record audio via microphone.
* Send audio to backend for **transcription** and AI response.
* Receive AI responses and display them in a chat window.
* Supports **roleplay mode** with different scenarios.
* Supports multiple languages (English `en-US` and Hindi `hi-IN`).
* AI response is read aloud using **speech synthesis**.
* Auto-scroll chat window to latest messages.
* Emoji-friendly chat interface.

---

## **Frontend Flow / Workflow**

1. **User Interaction**

   * User clicks **record** to start recording their voice.
   * The audio is captured in **webm** format using the browser `MediaRecorder` API.

2. **Sending Audio**

   * Recording stops → audio blob is prepared.
   * Audio blob, language, mode, and roleplay topic are sent as `FormData` to the **backend** `/api/chat`.

3. **Backend Processing**

   * Backend converts audio to WAV.
   * Transcribes audio using AI (Whisper/Together AI).
   * Generates AI response using Together AI.
   * Response is sent back as JSON.

4. **Frontend Response**

   * Response is displayed in the chat window.
   * Speech synthesis reads out the AI response.
   * Conversation is stored per language and mode for multi-session continuity.

---

## **Installation**

1. Clone the repo:

```bash
git clone <repo-url>
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```
REACT_APP_BACKEND_URL=http://localhost:3001
```

4. Start development server:

```bash
npm start
```

Frontend will run on `http://localhost:3000`.

---

## **Usage**

* Click **Start Recording** to speak to the AI.
* Choose **Language**: `en-US` or `hi-IN`.
* Choose **Mode**:

  * `Free Chat` – general conversation.
  * `Roleplay` – scenarios like At School, At Home, At the Store.
* Stop recording → wait for AI reply.
* AI response will appear in chat and be read aloud.

---

## **Key Notes**

* Conversations are stored per `(mode + language)` key:

```
'free-chat-en-US', 'At School-en-US', 'At Home-en-US', 'At the Store-en-US'
'free-chat-hi-IN', 'At School-hi-IN', ...
```

* Speech synthesis automatically **removes emojis** to avoid pronunciation issues.
* Auto-scroll ensures the latest messages are always visible.

---

## **Workflow Diagram**

```
User (Frontend)
      |
      |  Records audio (webm)
      v
  App.js (MediaRecorder)
      |
      |  Sends audio + language + mode + topic
      v
  Backend API (/api/chat)
      |
      |  Convert → Transcribe → Generate AI Response
      v
  Response JSON (userText, aiReply)
      |
      |  Display in chat window
      |  Speech synthesis reads AI response
      v
User (Frontend)
```

---