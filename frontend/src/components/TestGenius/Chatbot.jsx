import { useState, useEffect } from 'react';
import Header from './Header';
import ChatContainer from './ChatContainer';
import MessageInput from './MessageInput';
import { ChatProvider } from './ChatContext';
import { useAccessibility } from '../Accessibility/AccessibilityProvider';

function Chatbot() {
  const { speak, announce } = useAccessibility();
  
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

  // Announce page load and functionality
  useEffect(() => {
    announce('TestGenius AI Test Case Generator loaded. Use this interface to generate and review test cases.');
    speak('Welcome to TestGenius. You can interact with the AI to generate test cases or review existing ones.');
  }, [announce, speak]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    
    // Announce theme change
    const themeText = newDarkMode ? 'dark mode' : 'light mode';
    speak(`Switched to ${themeText}`);
    announce(`Theme changed to ${themeText}`);
  };

  return (
    <ChatProvider>
      
      {/* Main Chatbot Layout */}
      <div 
        className="flex flex-col h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
        role="application"
        aria-label="TestGenius AI Test Case Generator"
      >
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <main 
          className="flex-1 flex flex-col overflow-hidden md:ml-64"
          role="main"
          aria-label="Chat interface for test case generation"
        >
          <ChatContainer />

          <div 
            className="p-4 border-t border-slate-200 dark:border-slate-700"
            role="region"
            aria-label="Message input area"
          >
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