import { useState, useEffect } from 'react';
import Header from './Header';
import ChatContainer from './ChatContainer';
import MessageInput from './MessageInput';
import { ChatProvider } from './ChatContext';
import './Chatbot.css'; 

function Chatbot() {
  const [darkMode, setDarkMode] = useState(false);

  // Check for dark mode preference
  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);

    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <ChatProvider>
      <div className="flex flex-col h-screen bg-background">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <ChatContainer />

          <div className="p-4 border-t border-border">
            <div className="container mx-auto max-w-4xl">
              <MessageInput />
            </div>
          </div>
        </main>
      </div>
    </ChatProvider>
  );
}

export default Chatbot;
