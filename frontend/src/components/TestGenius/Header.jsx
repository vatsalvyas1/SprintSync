import { useState } from 'react';
import { Moon, Sun, Settings, Trash2 } from 'lucide-react';
import SystemPromptDialog from './SystemPromptDialog';
import { useChat } from './ChatContext';

const Header = ({ darkMode, toggleDarkMode }) => {
  const [showSystemPromptDialog, setShowSystemPromptDialog] = useState(false);
  const { clearMessages } = useChat();

  return (
    <>
      <header className="border-b border-slate-200 dark:border-slate-700 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 sticky top-0 z-10 md:ml-64">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                className="w-6 h-6 text-purple-600 dark:text-purple-400"
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 6V2H8" />
                <path d="M5 10v12h14V10" />
                <path d="M22 10H2" />
                <path d="M7 15h0" />
                <path d="M17 15h0" />
                <path d="M12 15v3" />
              </svg>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => clearMessages()}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
              aria-label="Clear conversation"
              title="Clear conversation"
            >
              <Trash2 size={18} />
            </button>
            
            <button
              onClick={() => setShowSystemPromptDialog(true)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
              aria-label="System prompt settings"
              title="System prompt settings"
            >
              <Settings size={18} />
            </button>
            
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>
      
      <SystemPromptDialog 
        isOpen={showSystemPromptDialog} 
        onClose={() => setShowSystemPromptDialog(false)} 
      />
    </>
  );
};

export default Header;