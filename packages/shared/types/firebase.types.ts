export type WithId<T> = T & { id: string };

export interface ChatMessage {
  content: string;
  createdBy: string;
  createdAt: number;
}

export interface PublicChatRoom {
  name: string;
}

export interface PrivateChatRoom {
  name: string;
  createdBy: string;
  createdAt: number;
}
