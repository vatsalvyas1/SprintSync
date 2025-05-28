import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useChat } from './ChatContext';

const MessageInput = () => {
  const [input, setInput] = useState('');
  const { sendMessage, loading } = useChat();
  const textareaRef = useRef(null);

  // Auto-resize the textarea as content grows
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = `${newHeight}px`;
    }
  }, [input]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim() || loading) return;
    
    try {
      await sendMessage(input);
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-end">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the feature or application to test..."
          className="flex-1 resize-none p-4 pr-12 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary transition-all min-h-[56px] max-h-[200px]"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className={`absolute right-3 bottom-3 p-2 rounded-md transition-colors ${
            input.trim() && !loading
              ? 'bg-primary text-white hover:bg-primary-dark'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
