import { create } from 'zustand';

export type Contact = {
  id: string;
  name: string;
  avatar: string;
  role: 'driver' | 'spotter' | 'crew';
  createdAt: Date;
};

interface ContactState {
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id' | 'createdAt'>) => void;
  removeContact: (id: string) => void;
}

export const useContactStore = create<ContactState>((set) => ({
  contacts: [],
  addContact: (contact) =>
    set((state) => ({
      contacts: [
        ...state.contacts,
        {
          ...contact,
          id: Date.now().toString(),
          createdAt: new Date(),
        },
      ],
    })),
  removeContact: (id) =>
    set((state) => ({
      contacts: state.contacts.filter((contact) => contact.id !== id),
    })),
}));