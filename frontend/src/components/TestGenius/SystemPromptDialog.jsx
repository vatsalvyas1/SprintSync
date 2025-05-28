import { useState, useEffect } from 'react';
import { X, Settings } from 'lucide-react';
import { useChat } from './ChatContext';

const SystemPromptDialog = ({ isOpen, onClose }) => {
  const { systemPrompt, setSystemPrompt } = useChat();
  const [localPrompt, setLocalPrompt] = useState(systemPrompt);
  const [showDialog, setShowDialog] = useState(isOpen);

  useEffect(() => {
    setShowDialog(isOpen);
    setLocalPrompt(systemPrompt);
  }, [isOpen, systemPrompt]);

  const handleSave = () => {
    setSystemPrompt(localPrompt);
    onClose();
  };

  const handleReset = () => {
    const defaultPrompt = localStorage.getItem('defaultSystemPrompt') || systemPrompt;
    setLocalPrompt(defaultPrompt);
  };

  if (!showDialog) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 fade-in">
      <div className="bg-card rounded-lg shadow-lg max-w-2xl w-full mx-4 slide-in">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Settings size={20} className="text-primary" />
            System Prompt
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-card-foreground transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <p className="text-muted-foreground mb-4">
            Customize the system prompt to control how the AI generates test cases. This prompt sets the tone, format, and requirements for the generated content.
          </p>
          <div className="mb-4">
            <label htmlFor="systemPrompt" className="block text-sm font-medium mb-1">
              System Prompt
            </label>
            <textarea
              id="systemPrompt"
              value={localPrompt}
              onChange={(e) => setLocalPrompt(e.target.value)}
              className="w-full h-64 p-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
              placeholder="Enter system prompt to guide the AI's responses"
            />
          </div>
          <div className="flex justify-between">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-card-foreground transition-colors"
            >
              Reset to Default
            </button>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemPromptDialog;
