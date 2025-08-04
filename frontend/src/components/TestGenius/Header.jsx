import { useState } from "react";
import { Moon, Sun, Settings, Trash2, Bot } from "lucide-react";
import SystemPromptDialog from "./SystemPromptDialog";
import { useChat } from "./ChatContext";
import { useAccessibility } from "../Accessibility/AccessibilityProvider";

const Header = ({ darkMode, toggleDarkMode }) => {
    const [showSystemPromptDialog, setShowSystemPromptDialog] = useState(false);
    const { clearMessages, isReviewMode } = useChat();
    const { speak, announce } = useAccessibility();

    return (
        <>
            <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md md:ml-64 dark:border-slate-700 dark:bg-slate-900/80">
                <div className="container mx-auto flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="h-6 w-6 text-purple-600 dark:text-purple-400"
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
                        {isReviewMode && (
                            <div className="flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-1 dark:bg-blue-900/30">
                                <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                    Review Mode
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                clearMessages();
                                speak('Conversation cleared');
                                announce('All messages have been cleared from the conversation');
                            }}
                            onFocus={() => speak('Clear conversation button')}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    clearMessages();
                                    speak('Conversation cleared');
                                    announce('All messages have been cleared from the conversation');
                                }
                            }}
                            className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                            aria-label="Clear conversation"
                            title="Clear conversation"
                        >
                            <Trash2 size={18} />
                        </button>

                        <button
                            onClick={() => {
                                setShowSystemPromptDialog(true);
                                speak('Opening system prompt settings');
                                announce('System prompt settings dialog opened');
                            }}
                            onFocus={() => speak('System prompt settings button')}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    setShowSystemPromptDialog(true);
                                    speak('Opening system prompt settings');
                                    announce('System prompt settings dialog opened');
                                }
                            }}
                            className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                            aria-label="System prompt settings"
                            title="System prompt settings"
                        >
                            <Settings size={18} />
                        </button>

                        <button
                            onClick={toggleDarkMode}
                            onFocus={() => {
                                const modeText = darkMode ? 'Switch to light mode' : 'Switch to dark mode';
                                speak(modeText + ' button');
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    toggleDarkMode();
                                }
                            }}
                            className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                            aria-label={
                                darkMode
                                    ? "Switch to light mode"
                                    : "Switch to dark mode"
                            }
                            title={
                                darkMode
                                    ? "Switch to light mode"
                                    : "Switch to dark mode"
                            }
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
