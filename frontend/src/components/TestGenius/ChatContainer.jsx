import { useRef, useEffect } from 'react';
import Message from './Message';
import { useChat } from './ChatContext';

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
      className="flex-1 overflow-y-auto p-4 space-y-4 bg-background"
    >
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center px-4">
          <div className="max-w-md space-y-4">
            <h2 className="text-2xl font-semibold text-card-foreground">Welcome to TestGenius</h2>
            <p className="text-muted-foreground">
              Describe your application or feature to generate comprehensive manual test cases using AI.
            </p>
            <div className="bg-muted/50 p-4 rounded-lg text-left border border-border">
              <p className="font-medium mb-2 text-card-foreground">Try these examples:</p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>"Generate test cases for a login functionality with email and password"</li>
                <li>"Create test scenarios for an e-commerce shopping cart"</li>
                <li>"Design test cases for a file upload feature that supports multiple file formats"</li>
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
            <div className="flex justify-start mb-4 animate-slide-in">
              <div className="bg-card rounded-lg shadow-message border border-border rounded-tl-none p-6">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
              </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChatContainer;