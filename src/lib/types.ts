export interface Conversation {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
}

export interface Model {
  id: string;
  name: string;
  logo?: string;
  created_at: string;
}

export interface Prompt {
  id: string;
  conversation_id: string;
  content: string;
  created_at: string;
}

export interface Response {
  id: string;
  prompt_id: string;
  model_id: string;
  content: string;
  created_at: string;
}

export interface Message {
  prompt: string;
  created_at: string;
  responses: {
    model_id: string;
    model_name: string;
    content: string;
    created_at: string;
  }[];
}

// API Request/Response types
export interface CreateConversationRequest {
  title: string;
}

export interface CreateConversationResponse {
  conversation_id: string;
}

export interface SendPromptRequest {
  conversation_id: string;
  content: string;
  model_ids: string[];
}

export interface SendPromptResponse {
  prompt_id: string;
  responses: {
    model_id: string;
    content: string;
  }[];
}

// User types
export interface User {
  id: string;
  email?: string;
  created_at: string;
}

// Chat History types
export interface ChatHistoryMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ModelChatHistory {
  conversation_id: string;
  messages: ChatHistoryMessage[];
  last_updated: string;
}

export interface OpenRouterMessage {
  role: "user" | "assistant";
  content: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
}

export interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}
