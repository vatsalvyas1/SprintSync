import { useState, useEffect } from 'react';
import { X, Settings } from 'lucide-react';
import { useChat } from './ChatContext';

// Define the default system prompt (same as in ChatContext.jsx)
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

const SystemPromptDialog = ({ isOpen, onClose }) => {
  const { systemPrompt, setSystemPrompt } = useChat();
  const [localPrompt, setLocalPrompt] = useState(systemPrompt);
  const [showDialog, setShowDialog] = useState(isOpen);

  useEffect(() => {
    setShowDialog(isOpen);
    setLocalPrompt(systemPrompt);
  }, [isOpen, systemPrompt]);

  const handleSave = () => {
    setSystemPrompt(localPrompt);
    onClose();
  };

  const handleReset = () => {
    setLocalPrompt(defaultSystemPrompt);
  };

  if (!showDialog) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-2xl w-full mx-4 animate-[slideIn_0.3s_ease-out]">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
            <Settings size={20} className="text-purple-500 dark:text-purple-400" />
            System Prompt
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Customize the system prompt to control how the AI generates test cases. This prompt sets the tone, format, and requirements for the generated content.
          </p>
          <div className="mb-4">
            <label htmlFor="systemPrompt" className="block text-sm font-medium mb-1 text-slate-900 dark:text-white">
              System Prompt
            </label>
            <textarea
              id="systemPrompt"
              value={localPrompt}
              onChange={(e) => setLocalPrompt(e.target.value)}
              className="w-full h-64 p-3 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 font-mono text-sm"
              placeholder="Enter system prompt to guide the AI's responses"
            />
          </div>
          <div className="flex justify-between">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Reset to Default
            </button>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-500 text-white rounded-md transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemPromptDialog;