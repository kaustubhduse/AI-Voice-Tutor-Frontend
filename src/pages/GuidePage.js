import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function GuidePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="p-8 text-gray-700 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="max-w-4xl mx-auto bg-white/70 backdrop-blur-md p-10 rounded-2xl shadow-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants} className="text-4xl font-bold text-center mb-8 text-orange-500">How to Use SpeakGenie 🚀</motion.h1>
        
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-teal-600">1. Choose Your Mode</h2>
          <p className="text-lg">Select a language and a conversation mode from the dropdowns on the chat page. 'Free Chat' lets you talk about anything, while 'Roleplay' gives you fun scenarios to practice!</p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-teal-600">2. Tap the Mic and Speak</h2>
          <p className="text-lg">When you're ready, tap the large microphone button. It will pulse to show it's listening. Speak clearly and when you're done, tap it again to stop.</p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-teal-600">3. Listen and Read</h2>
          <p className="text-lg">Genie will think for a moment and then reply! You'll see the text in the chat window and hear the response spoken out loud. Practice your pronunciation by repeating after Genie.</p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="text-center mt-10">
          <Link to="/">
            <motion.button
              className="bg-teal-500 text-white font-bold py-3 px-8 rounded-full shadow-lg text-xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Let's Start Chatting!
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default GuidePage;