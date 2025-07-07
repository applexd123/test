export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  model?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ModelConfig {
  id: string;
  name: string;
  description: string;
  provider: string;
  maxTokens: number;
  temperature: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export interface AppSettings {
  selectedModel: string;
  theme: 'dark' | 'light';
  fontSize: 'small' | 'medium' | 'large';
  autoSave: boolean;
  showTimestamps: boolean;
}

export interface WebLink {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  icon?: string;
}