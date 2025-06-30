import { useState, useEffect } from 'react';
import Header from './Header';
import ChatContainer from './ChatContainer';
import MessageInput from './MessageInput';
import { ChatProvider } from './ChatContext';

function Chatbot() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage first
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) {
      return stored === 'true';
    }
    // Default to light mode
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
  };

  return (
    <ChatProvider>
      
      {/* Main Chatbot Layout */}
      <div className="flex flex-col h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <main className="flex-1 flex flex-col overflow-hidden md:ml-64">
          <ChatContainer />

          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
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