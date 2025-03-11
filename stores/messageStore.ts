import { create } from 'zustand';

export type Message = {
  id: string;
  text: string;
  sender: 'spotter' | 'driver';
  senderId: string;
  timestamp: Date;
  teamId: string;
};

interface MessageState {
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  getTeamMessages: (teamId: string) => Message[];
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    }],
  })),
  getTeamMessages: (teamId) => {
    return get().messages
      .filter(message => message.teamId === teamId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  },
}));