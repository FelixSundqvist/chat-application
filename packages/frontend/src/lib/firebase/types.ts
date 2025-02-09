export type WithId<T> = T & { id: string };

export interface ChatMessage {
  content: string;
  createdBy: string;
  createdAt: number;
}

export interface ChatRoom {
  name: string;
}
