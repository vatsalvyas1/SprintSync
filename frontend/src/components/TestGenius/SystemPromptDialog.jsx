import { useState, useEffect } from "react";
import { X, Settings } from "lucide-react";
import { useChat } from "./ChatContext";
import { useAccessibility } from "../Accessibility/AccessibilityProvider";

// Define the default system prompts (same as in ChatContext.jsx)
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

const defaultReviewPrompt = `You are an expert test engineer who specializes in reviewing and analyzing test cases for quality, completeness, and effectiveness.

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

const SystemPromptDialog = ({ isOpen, onClose }) => {
  const { systemPrompt, setSystemPrompt, reviewPrompt, setReviewPrompt, isReviewMode } = useChat();
  const { speak, announce } = useAccessibility();
  const [localPrompt, setLocalPrompt] = useState(systemPrompt);
  const [showDialog, setShowDialog] = useState(isOpen);

  useEffect(() => {
    setShowDialog(isOpen);
    // When opening the dialog, set the local prompt to the appropriate prompt based on mode
    if (isOpen) {
      if (isReviewMode) {
        setLocalPrompt(reviewPrompt);
      } else {
        setLocalPrompt(systemPrompt);
      }
      // Announce dialog opening
      const dialogType = isReviewMode ? 'Test Case Review Prompt' : 'System Prompt';
      announce(`${dialogType} settings dialog opened`);
      speak(`${dialogType} settings dialog is now open`);
    }
  }, [isOpen, systemPrompt, reviewPrompt, isReviewMode, announce, speak]);

  const handleSave = () => {
    if (isReviewMode) {
      setReviewPrompt(localPrompt);
    } else {
      setSystemPrompt(localPrompt);
    }
    speak('Settings saved successfully');
    announce('System prompt settings have been saved');
    onClose();
  };

  const handleReset = () => {
    setLocalPrompt(isReviewMode ? defaultReviewPrompt : defaultSystemPrompt);
    speak('Settings reset to default');
    announce('System prompt has been reset to default settings');
  };

    if (!showDialog) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex animate-[fadeIn_0.2s_ease-out] items-center justify-center bg-black/50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
        >
            <div className="mx-4 w-full max-w-2xl animate-[slideIn_0.3s_ease-out] rounded-lg bg-white shadow-lg dark:bg-slate-800">
                <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700">
                                         <h2 
                            id="dialog-title"
                            className="flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-white"
                        >
                         <Settings
                             size={20}
                             className="text-purple-500 dark:text-purple-400"
                         />
                         {isReviewMode ? "Test Case Review Prompt" : "System Prompt"}
                     </h2>
                    <button
                        onClick={() => {
                            onClose();
                            speak('Dialog closed');
                            announce('Settings dialog has been closed');
                        }}
                        onFocus={() => speak('Close dialog button')}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onClose();
                                speak('Dialog closed');
                                announce('Settings dialog has been closed');
                            }
                        }}
                        className="text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                        aria-label="Close dialog"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                                         <p className="mb-4 text-slate-600 dark:text-slate-300">
                         {isReviewMode 
                           ? "Customize the review prompt to control how the AI analyzes test cases. This prompt sets the criteria and format for test case reviews."
                           : "Customize the system prompt to control how the AI generates test cases. This prompt sets the tone, format, and requirements for the generated content."
                         }
                     </p>
                    <div className="mb-4">
                                                 <label
                             htmlFor="systemPrompt"
                             className="mb-1 block text-sm font-medium text-slate-900 dark:text-white"
                         >
                             {isReviewMode ? "Review Prompt" : "System Prompt"}
                         </label>
                        <textarea
                            id="systemPrompt"
                            value={localPrompt}
                            onChange={(e) => setLocalPrompt(e.target.value)}
                            onFocus={() => speak('System prompt text area focused')}
                            className="h-64 w-full rounded-md border border-slate-200 bg-white p-3 font-mono text-sm text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-purple-400"
                            placeholder="Enter system prompt to guide the AI's responses"
                            aria-describedby="prompt-description"
                        />
                    </div>
                    <div className="flex justify-between">
                        <button
                            onClick={handleReset}
                            onFocus={() => speak('Reset to default button')}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleReset();
                                }
                            }}
                            className="px-4 py-2 text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                            aria-label="Reset prompt to default settings"
                        >
                            Reset to Default
                        </button>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    onClose();
                                    speak('Dialog cancelled');
                                    announce('Settings dialog cancelled, no changes saved');
                                }}
                                onFocus={() => speak('Cancel button')}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        onClose();
                                        speak('Dialog cancelled');
                                        announce('Settings dialog cancelled, no changes saved');
                                    }
                                }}
                                className="rounded-md border border-slate-200 px-4 py-2 text-slate-900 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                onFocus={() => speak('Save settings button')}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleSave();
                                    }
                                }}
                                className="rounded-md bg-purple-500 px-4 py-2 text-white transition-colors hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-500"
                                aria-label="Save prompt settings"
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
