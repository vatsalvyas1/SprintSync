import { useState } from "react";
import { Copy, Check, User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";

const Message = ({ message }) => {
    const [copied, setCopied] = useState(false);

    const isUser = message.role === "user";

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(message.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy message:", err);
        }
    };

    const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div
            className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 animate-[fadeIn_0.3s_ease-out]`}
        >
            <div
                className={`max-w-[85%] rounded-lg shadow-md md:max-w-[75%] ${
                    isUser
                        ? "rounded-tr-none bg-purple-500 text-white"
                        : "rounded-tl-none border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
                } `}
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
                                alt="User upload"
                                className="max-h-48 max-w-xs rounded border"
                                style={{ objectFit: "cover" }}
                            />
                        </div>
                    )}
                    {isUser ? (
                        <div className="whitespace-pre-wrap">
                            {message.content}
                        </div>
                    ) : (
                        <div className="prose prose-sm dark:prose-invert prose-slate dark:prose-slate max-w-none">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                    )}

                    <button
                        onClick={copyToClipboard}
                        className={`absolute top-3 right-3 rounded-md p-1.5 transition-colors ${
                            isUser
                                ? "text-white/70 hover:bg-white/20 hover:text-white"
                                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                        } `}
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
