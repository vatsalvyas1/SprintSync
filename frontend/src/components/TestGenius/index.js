export const Message = {
  id: String,
  role: String, // 'user' | 'assistant' | 'system'
  content: String,
  timestamp: Date
};

export const TestCase = {
  id: String,
  title: String,
  description: String,
  steps: Array,
  expectedResults: Array
};

export const ChatContextType = {
  messages: Array,
  loading: Boolean,
  error: String,
  addMessage: Function,
  sendMessage: Function,
  clearMessages: Function,
  systemPrompt: String,
  setSystemPrompt: Function
};