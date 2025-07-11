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

const testCaseReviewPrompt = `You are an expert test engineer who specializes in reviewing and analyzing test cases for quality, completeness, and effectiveness.

When I send you a test case to review, provide a comprehensive analysis that includes:

1. **Why this test case is good** - Highlight the strengths and positive aspects
2. **Suggestions for improvement** - Areas where the test case could be enhanced
3. **Potential errors or issues** - Identify any problems, gaps, or inconsistencies
4. **Bug detection probability** - Estimate the percentage likelihood of this test case finding bugs (0-100%)

Format your response using markdown with clear sections:
- Use headers (##) for each section
- Use bullet points for lists
- Use blockquotes for important notes
- Include a summary score or rating

Consider these aspects in your review:
- Test case clarity and understandability
- Coverage of functionality
- Edge cases and boundary conditions
- Realistic and achievable steps
- Proper preconditions and expected results
- Maintainability and reusability

Example format:
## Why This Test Case is Good
* Clear and descriptive title
* Well-defined preconditions
* Logical step sequence

## Suggestions for Improvement
* Consider adding negative test scenarios
* Include performance considerations

## Potential Issues
* Missing error handling scenarios
* Unclear expected results

## Bug Detection Probability: 75%
This test case has a good chance of finding functional bugs but may miss edge cases.`;

const ChatContext = createContext(undefined);

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [systemPrompt, setSystemPrompt] = useState(defaultSystemPrompt);
    const [reviewPrompt, setReviewPrompt] = useState(testCaseReviewPrompt);
    const [isReviewMode, setIsReviewMode] = useState(false);

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

                // Use review prompt if in review mode, otherwise use regular system prompt
                const currentPrompt = isReviewMode
                    ? reviewPrompt
                    : systemPrompt;

                const response = await geminiService.generateContent(
                    content,
                    currentPrompt,
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
        [systemPrompt, isReviewMode]
    );

    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    const updateSystemPrompt = useCallback((prompt) => {
        setSystemPrompt(prompt);
    }, []);

    const updateReviewPrompt = useCallback((prompt) => {
        setReviewPrompt(prompt);
    }, []);

    const startReviewMode = useCallback(() => {
        setIsReviewMode(true);
        setMessages([]);
    }, []);

    const exitReviewMode = useCallback(() => {
        setIsReviewMode(false);
        setMessages([]);
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
                reviewPrompt,
                setReviewPrompt: updateReviewPrompt,
                isReviewMode,
                startReviewMode,
                exitReviewMode,
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
