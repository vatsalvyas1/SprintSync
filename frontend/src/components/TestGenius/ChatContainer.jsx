import { useRef, useEffect } from "react";
import Message from "./Message";
import { useChat } from "./ChatContext";

const ChatContainer = () => {
    const { messages, loading } = useChat();
    const containerRef = useRef(null);

    // Scroll to bottom when messages change or loading state changes
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages, loading]);

    return (
        <div
            ref={containerRef}
            className="bg-gray-50 dark:bg-gray-900 flex-1 space-y-4 overflow-y-auto p-4"
        >
            {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                    <div className="animate-fade-in max-w-md space-y-6">
                        <h2 className="text-gray-800 dark:text-white text-2xl font-semibold">
                            Welcome to TestGenius
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Describe your application or feature to generate
                            comprehensive manual test cases using AI.
                        </p>
                        <div className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg border p-6 text-left shadow-sm">
                            <p className="text-gray-800 dark:text-white mb-3 font-medium">
                                Try these examples:
                            </p>
                            <ul className="text-gray-600 dark:text-gray-400 space-y-3">
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>
                                        "Generate test cases for a login
                                        functionality with email and password"
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>
                                        "Create test scenarios for an e-commerce
                                        shopping cart"
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>
                                        "Design test cases for a file upload
                                        feature that supports multiple file
                                        formats"
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {messages.map((message) => (
                        <Message key={message.id} message={message} />
                    ))}

                    {loading && (
                        <div className="animate-slide-in mb-4 flex justify-start">
                            <div className="bg-card shadow-message border-border flex items-center gap-3 rounded-lg rounded-tl-none border p-6">
                                <div className="flex items-center gap-1">
                                    <div 
                                        className="bg-primary h-2 w-2 rounded-full"
                                        style={{ 
                                            animationDelay: "0s"
                                        }}
                                    ></div>
                                    <div
                                        className="bg-primary h-2 w-2 rounded-full "
                                        style={{ 
                                            animationDelay: "0.1s"
                                        }}
                                    ></div>
                                    <div
                                        className="bg-primary h-2 w-2 rounded-full"
                                        style={{ 
                                            animationDelay: "0.2s"
                                        }}
                                    ></div>
                                </div>
                                <span className="ml-2 font-medium text-slate-500 dark:text-slate-400">
                                    Thinking...
                                </span>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ChatContainer;