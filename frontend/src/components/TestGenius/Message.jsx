import { useState } from "react";
import { Copy, Check, User, Bot } from "lucide-react";
import { useAccessibility } from "../Accessibility/AccessibilityProvider";

// Simple markdown renderer for basic formatting
const SimpleMarkdownRenderer = ({ content }) => {
    const renderContent = (text) => {
        // Handle bold text **text**
        let rendered = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Handle numbered lists
        rendered = rendered.replace(/^(\d+)\.\s\*\*(.*?)\*\*/gm, '<div class="mb-2"><strong>$1. $2</strong></div>');
        
        // Handle regular numbered lists
        rendered = rendered.replace(/^(\d+)\.\s(.+)/gm, '<div class="mb-2">$1. $2</div>');
        
        // Handle line breaks
        rendered = rendered.replace(/\n\n/g, '<br><br>');
        rendered = rendered.replace(/\n/g, '<br>');
        
        return rendered;
    };

    return (
        <div 
            className="prose prose-sm dark:prose-invert prose-slate dark:prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: renderContent(content) }}
        />
    );
};

const Message = ({ message }) => {
    const [copied, setCopied] = useState(false);
    const { speak, announce } = useAccessibility();

    const isUser = message.role === "user";

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(message.content);
            setCopied(true);
            speak("Message copied to clipboard");
            announce("Message content has been copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy message:", err);
            speak("Failed to copy message");
            announce("Error: Could not copy message to clipboard");
        }
    };

    const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div
            className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 animate-[fadeIn_0.3s_ease-out]`}
            role="article"
            aria-label={`Message from ${isUser ? "you" : "TestGenius AI"} at ${formattedTime}`}
        >
            <div
                className={`max-w-[85%] rounded-lg shadow-md md:max-w-[75%] ${
                    isUser
                        ? "rounded-tr-none bg-purple-500 text-white"
                        : "rounded-tl-none border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
                } `}
                tabIndex="0"
                onFocus={() => {
                    const sender = isUser ? "your" : "TestGenius AI";
                    speak(`${sender} message: ${message.content.substring(0, 100)}${message.content.length > 100 ? '...' : ''}`);
                }}
            >
                <div
                    className={`flex items-center gap-2 p-3 ${
                        isUser
                            ? "border-b border-purple-400/30"
                            : "border-b border-slate-200 dark:border-slate-700"
                    } `}
                >
                    <div className="flex items-center gap-2">
                        {isUser ? (
                            <User size={18} className="text-white/70" />
                        ) : (
                            <Bot
                                size={18}
                                className="text-purple-500 dark:text-purple-400"
                            />
                        )}
                        <span className="font-medium">
                            {isUser ? "You" : "TestGenius"}
                        </span>
                    </div>
                    <span
                        className={`ml-auto text-xs ${isUser ? "text-white/70" : "text-slate-500 dark:text-slate-400"} `}
                    >
                        {formattedTime}
                    </span>
                </div>

                <div className="relative p-4">
                    {message.image && (
                        <div className="mb-2">
                            <img
                                src={message.image}
                                alt="User uploaded image"
                                className="max-h-48 max-w-xs rounded border"
                                style={{ objectFit: "cover" }}
                                onLoad={() => {
                                    if (!isUser) {
                                        speak("Image attached to message");
                                    }
                                }}
                            />
                        </div>
                    )}
                    {isUser ? (
                        <div className="whitespace-pre-wrap">
                            {message.content}
                        </div>
                    ) : (
                        <SimpleMarkdownRenderer content={message.content} />
                    )}

                    <button
                        onClick={copyToClipboard}
                        onFocus={() => speak("Copy message button")}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                copyToClipboard();
                            }
                        }}
                        className={`absolute top-3 right-3 rounded-md p-1.5 transition-colors ${
                            isUser
                                ? "text-white/70 hover:bg-white/20 hover:text-white"
                                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                        } `}
                        aria-label={copied ? "Message copied" : "Copy message to clipboard"}
                        title={copied ? "Message copied" : "Copy to clipboard"}
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Message;