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
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-slide-in`}>
      <div className={`
        max-w-[85%] md:max-w-[75%] rounded-lg shadow-message
        ${isUser 
          ? 'bg-purple-500 text-white rounded-tr-none' 
          : 'bg-white border border-gray-200 rounded-tl-none'
        }
      `}>
        <div className="flex items-center gap-2 p-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            {isUser ? (
              <User size={18} className="text-white/70" />
            ) : (
              <Bot size={18} className="text-primary" />
            )}
            <span className="font-medium">
              {isUser ? 'You' : 'TestGenius'}
            </span>
          </div>
          <span className="text-xs opacity-70 ml-auto">{formattedTime}</span>
        </div>
        
        <div className="p-4 relative">
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
          
          <button
            onClick={copyToClipboard}
            className={`
              absolute top-3 right-3 p-1.5 rounded-md transition-colors
              ${isUser 
                ? 'hover:bg-white/20 text-white/70 hover:text-white' 
                : 'hover:bg-muted text-muted-foreground hover:text-card-foreground'
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