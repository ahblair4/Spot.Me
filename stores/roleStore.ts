import { create } from 'zustand';

type Role = 'spotter' | 'driver';

interface RoleState {
  role: Role;
  toggleRole: () => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  role: 'spotter',
  toggleRole: () => set((state) => ({ 
    role: state.role === 'spotter' ? 'driver' : 'spotter' 
  })),
}));