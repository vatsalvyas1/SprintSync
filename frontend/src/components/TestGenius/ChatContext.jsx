import {
    createContext,
    useState,
    useContext,
    useEffect,
    useCallback,
} from "react";

import { geminiService } from "./geminiService";

const defaultSystemPrompt = `You are an expert test engineer who specializes in creating manual testing test cases.

When I send you a feature or application description, respond with a set of comprehensive manual test cases that cover the functionality.

For each test case, include:
1. A clear, descriptive title
2. Preconditions or setup requirements
3. Numbered steps to execute
4. Expected results for each step
5. Any edge cases or boundary conditions to consider

Format your response using markdown to ensure readability:
- Use headers (##) for test case titles
- Use bullet points for preconditions
- Use numbered lists for steps
- Use blockquotes for expected results
- Group related test cases together

Remember to consider:
- Happy path scenarios
- Error/exception handling
- Boundary conditions
- Performance considerations
- Security aspects when relevant
- Accessibility requirements when applicable

Example format:
## Test Case 1: Verify User Login with Valid Credentials
**Preconditions:**
* User has a registered account
* User is on the login page

**Steps:**
1. Enter valid username
2. Enter valid password
3. Click on the login button

**Expected Results:**
> User is successfully logged in
> User is redirected to the dashboard
> Welcome message displays the user's name

Your test cases should be thorough but practical for manual execution.`;

const ChatContext = createContext(undefined);

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [systemPrompt, setSystemPrompt] = useState(defaultSystemPrompt);

    useEffect(() => {
        const savedMessages = localStorage.getItem("chatMessages");
        const savedPrompt = localStorage.getItem("systemPrompt");

        if (savedMessages) {
            try {
                const parsedMessages = JSON.parse(savedMessages);
                const messagesWithDateTimestamps = parsedMessages.map(
                    (msg) => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp),
                    })
                );
                setMessages(messagesWithDateTimestamps);
            } catch (e) {
                console.error("Failed to parse saved messages", e);
            }
        }

        if (savedPrompt) {
            setSystemPrompt(savedPrompt);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("chatMessages", JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        localStorage.setItem("systemPrompt", systemPrompt);
    }, [systemPrompt]);

    const addMessage = useCallback((message) => {
        const newMessage = {
            ...message,
            id: crypto.randomUUID(),
            timestamp: new Date(),
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
    }, []);

    const sendMessage = useCallback(
        async (content, image) => {
            if (!content.trim() && !image) return;

            let imageData = null;
            if (image) {
                // Convert image file to base64
                imageData = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(image);
                });
            }

            const userMessage = {
                id: crypto.randomUUID(),
                role: "user",
                content,
                image: imageData,
                timestamp: new Date(),
            };

            setMessages((prevMessages) => [...prevMessages, userMessage]);
            setLoading(true);
            setError(null);

            try {
                if (!geminiService.isConfigured()) {
                    throw new Error("Please set your Gemini API key first.");
                }

                const response = await geminiService.generateContent(
                    content,
                    systemPrompt,
                    imageData
                );

                const assistantMessage = {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    content: response,
                    timestamp: new Date(),
                };

                setMessages((prevMessages) => [
                    ...prevMessages,
                    assistantMessage,
                ]);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "An unknown error occurred"
                );
                console.error("Error sending message:", err);
            } finally {
                setLoading(false);
            }
        },
        [systemPrompt]
    );

    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    const updateSystemPrompt = useCallback((prompt) => {
        setSystemPrompt(prompt);
    }, []);

    return (
        <ChatContext.Provider
            value={{
                messages,
                loading,
                error,
                addMessage,
                sendMessage,
                clearMessages,
                systemPrompt,
                setSystemPrompt: updateSystemPrompt,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
};
