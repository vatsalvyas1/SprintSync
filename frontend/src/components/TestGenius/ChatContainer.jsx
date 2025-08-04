import { useRef, useEffect } from "react";
import Message from "./Message";
import { useChat } from "./ChatContext";
import { Bot, ArrowLeft } from "lucide-react";
import { useAccessibility } from "../Accessibility/AccessibilityProvider";

const ChatContainer = () => {
    const { messages, loading, isReviewMode, startReviewMode, exitReviewMode } =
        useChat();
    const containerRef = useRef(null);
    const { speak, announce } = useAccessibility();

    // Scroll to bottom when messages change or loading state changes
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages, loading]);

    // Announce new messages for screen readers and read AI responses aloud
    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === 'assistant') {
                announce('New AI response received');
                
                // Clean the message content for better speech synthesis
                let cleanContent = lastMessage.content
                    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
                    .replace(/\n\n/g, '. ') // Replace double line breaks with periods
                    .replace(/\n/g, ' ') // Replace single line breaks with spaces
                    .replace(/#{1,6}\s/g, '') // Remove markdown headers
                    .replace(/\d+\./g, 'Step') // Replace numbered lists with "Step"
                    .trim();
                
                // Speak the AI response content
                setTimeout(() => {
                    speak(cleanContent, { rate: 0.9 }); // Slightly slower for better comprehension
                }, 500); // Small delay to ensure the announcement is heard first
            }
        }
    }, [messages, announce, speak]);

    // Announce mode changes
    useEffect(() => {
        if (isReviewMode) {
            announce('Switched to Test Case Review Mode');
            speak('Now in review mode. You can paste test cases for analysis.');
        } else {
            announce('Switched to Test Generation Mode');
            speak('Now in generation mode. Describe your feature to generate test cases.');
        }
    }, [isReviewMode, announce, speak]);

    return (
        <div
            ref={containerRef}
            className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900"
            role="log"
            aria-live="polite"
            aria-label="Chat conversation"
        >
            {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                    <div className="animate-fade-in max-w-md space-y-6">
                        {isReviewMode ? (
                            <>
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                                    Test Case Review Mode
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Paste your test case below and I'll provide
                                    a comprehensive review including strengths,
                                    suggestions, potential issues, and bug
                                    detection probability.
                                </p>
                                <div className="rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                    <p className="mb-3 font-medium text-gray-800 dark:text-white">
                                        What I'll analyze:
                                    </p>
                                    <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>
                                                Why your test case is effective
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>
                                                Suggestions for improvement
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>
                                                Potential errors or gaps
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>
                                                Bug detection probability
                                                (0-100%)
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <button
                                    onClick={() => {
                                        exitReviewMode();
                                        speak('Switched back to test generation mode');
                                        announce('Exited review mode, now in test generation mode');
                                    }}
                                    onFocus={() => speak('Back to test generation button')}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            exitReviewMode();
                                            speak('Switched back to test generation mode');
                                            announce('Exited review mode, now in test generation mode');
                                        }
                                    }}
                                    className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                    aria-label="Back to test generation mode"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to Test Generation
                                </button>
                            </>
                        ) : (
                            <>
                                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                                    Welcome to TestGenius
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Describe your application or feature to
                                    generate comprehensive manual test cases
                                    using AI.
                                </p>
                                <div className="rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                    <p className="mb-3 font-medium text-gray-800 dark:text-white">
                                        Try these examples:
                                    </p>
                                    <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>
                                                "Generate test cases for a login
                                                functionality with email and
                                                password"
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>
                                                "Create test scenarios for an
                                                e-commerce shopping cart"
                                            </span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>
                                                "Design test cases for a file
                                                upload feature that supports
                                                multiple file formats"
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="flex justify-center">
                                    <button
                                        onClick={() => {
                                            startReviewMode();
                                            speak('Switched to review mode');
                                            announce('Entered test case review mode');
                                        }}
                                        onFocus={() => speak('Ask AI to review my test cases button')}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                startReviewMode();
                                                speak('Switched to review mode');
                                                announce('Entered test case review mode');
                                            }
                                        }}
                                        className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
                                        aria-label="Switch to test case review mode"
                                    >
                                        <Bot className="h-4 w-4" />
                                        Ask AI to Review My Test Cases
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    {messages.map((message) => (
                        <Message key={message.id} message={message} />
                    ))}

                    {loading && (
                        <div 
                            className="animate-slide-in mb-4 flex justify-start"
                            role="status"
                            aria-live="polite"
                            aria-label="AI is thinking"
                        >
                            <div className="bg-card shadow-message border-border flex items-center gap-3 rounded-lg rounded-tl-none border p-6">
                                <div className="flex items-center gap-1">
                                    <div
                                        className="bg-primary h-2 w-2 rounded-full"
                                        style={{
                                            animationDelay: "0s",
                                        }}
                                    ></div>
                                    <div
                                        className="bg-primary h-2 w-2 rounded-full"
                                        style={{
                                            animationDelay: "0.1s",
                                        }}
                                    ></div>
                                    <div
                                        className="bg-primary h-2 w-2 rounded-full"
                                        style={{
                                            animationDelay: "0.2s",
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
