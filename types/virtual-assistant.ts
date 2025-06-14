export interface Message {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  isUser: boolean;
}

export interface AssistantResponse {
  id: string;
  messageId: string;
  content: string;
  timestamp: string;
}

export interface AssistantSettings {
  userId: string;
  language: string;
  notifications: boolean;
  theme: 'light' | 'dark';
}

export interface VirtualAssistantState {
  loading: boolean;
  error: string | null;
  messages: Message[];
  responses: AssistantResponse[];
  settings: AssistantSettings | null;
  isTyping: boolean;
} 