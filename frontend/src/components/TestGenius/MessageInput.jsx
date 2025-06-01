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
          className="flex-1 resize-none p-4 pr-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-all min-h-[56px] max-h-[200px]"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className={`absolute right-3 bottom-3 p-2 rounded-md transition-colors ${
            input.trim() && !loading
              ? 'bg-purple-500 text-white hover:bg-purple-600 dark:hover:bg-purple-400'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
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