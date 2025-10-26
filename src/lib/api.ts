const STORAGE_KEY = "chatbot_base_url";
const DEFAULT_BASE_URL = "http://localhost:8000";

export function getBaseUrl(): string {
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_BASE_URL;
}

export function setBaseUrl(url: string): void {
  localStorage.setItem(STORAGE_KEY, url);
}

export interface Chat {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: number;
  chat_id: number;
  user_query: string;
  bot_response: string;
  conversation_order: number;
  created_at: string;
}

export interface ChatDetail extends Chat {
  conversations: Conversation[];
  total_conversations: number;
}

export interface ChatsResponse {
  chats: Chat[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export class ChatAPI {
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || getBaseUrl();
  }

  async createChat(title: string): Promise<Chat> {
    const response = await fetch(`${this.baseURL}/chats/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to create chat");
    }

    return response.json();
  }

  async getChats(page = 1, perPage = 50): Promise<ChatsResponse> {
    const response = await fetch(
      `${this.baseURL}/chats/?page=${page}&per_page=${perPage}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch chats");
    }

    return response.json();
  }

  async getChat(chatId: number): Promise<ChatDetail> {
    const response = await fetch(`${this.baseURL}/chats/${chatId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to fetch chat");
    }

    return response.json();
  }

  async sendMessage(chatId: number, query: string): Promise<Conversation> {
    const response = await fetch(`${this.baseURL}/chats/${chatId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to send message");
    }

    return response.json();
  }

  async deleteChat(chatId: number): Promise<void> {
    const response = await fetch(`${this.baseURL}/chats/${chatId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to delete chat");
    }
  }
}
