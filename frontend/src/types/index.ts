export type Role = "user" | "assistant" | "system";

export interface Message {
  role: Role;
  content: string;
}

export interface ChatRequest {
  messages: Message[];
  subject?: string;
}

export interface ChatResponse {
  reply: string;
  used_model: string;
}
