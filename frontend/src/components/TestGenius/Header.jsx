import { useState } from 'react';
import { Moon, Sun, Settings, Trash2 } from 'lucide-react';
import SystemPromptDialog from './SystemPromptDialog';
import { useChat } from './ChatContext';

const Header = ({ darkMode, toggleDarkMode }) => {
  const [showSystemPromptDialog, setShowSystemPromptDialog] = useState(false);
  const { clearMessages } = useChat();

  return (
    <>
      <header className="border-b border-border backdrop-blur-md bg-background/80 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                className="w-6 h-6 text-primary"
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
            <h1 className="text-xl font-bold">TestGenius</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => clearMessages()}
              className="p-2 text-muted-foreground hover:text-card-foreground hover:bg-muted rounded-md transition-colors"
              aria-label="Clear conversation"
              title="Clear conversation"
            >
              <Trash2 size={18} />
            </button>
            
            <button
              onClick={() => setShowSystemPromptDialog(true)}
              className="p-2 text-muted-foreground hover:text-card-foreground hover:bg-muted rounded-md transition-colors"
              aria-label="System prompt settings"
              title="System prompt settings"
            >
              <Settings size={18} />
            </button>
            
            <button
              onClick={toggleDarkMode}
              className="p-2 text-muted-foreground hover:text-card-foreground hover:bg-muted rounded-md transition-colors"
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
