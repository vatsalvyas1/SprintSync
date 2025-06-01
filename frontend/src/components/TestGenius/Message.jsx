import { useState } from 'react';
import { Copy, Check, User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Message = ({ message }) => {
  const [copied, setCopied] = useState(false);
  
  const isUser = message.role === 'user';
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };
  
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit'
  });
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-[fadeIn_0.3s_ease-out]`}>
      <div className={`
        max-w-[85%] md:max-w-[75%] rounded-lg shadow-md
        ${isUser 
          ? 'bg-purple-500 text-white rounded-tr-none' 
          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-tl-none'
        }
      `}>
        <div className={`
          flex items-center gap-2 p-3 
          ${isUser 
            ? 'border-b border-purple-400/30' 
            : 'border-b border-slate-200 dark:border-slate-700'
          }
        `}>
          <div className="flex items-center gap-2">
            {isUser ? (
              <User size={18} className="text-white/70" />
            ) : (
              <Bot size={18} className="text-purple-500 dark:text-purple-400" />
            )}
            <span className="font-medium">
              {isUser ? 'You' : 'TestGenius'}
            </span>
          </div>
          <span className={`
            text-xs ml-auto
            ${isUser ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'}
          `}>
            {formattedTime}
          </span>
        </div>
        
        <div className="p-4 relative">
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert prose-slate dark:prose-slate">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
          
          <button
            onClick={copyToClipboard}
            className={`
              absolute top-3 right-3 p-1.5 rounded-md transition-colors
              ${isUser 
                ? 'hover:bg-white/20 text-white/70 hover:text-white' 
                : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }
            `}
            aria-label="Copy message"
            title="Copy to clipboard"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Message;