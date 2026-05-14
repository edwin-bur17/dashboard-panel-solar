export interface Message {
  id: number
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export interface ApiResponse {
  content?: string;
  error?: string;
  details?: string;
}