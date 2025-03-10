import { create } from 'zustand';

type Team = {
  id: string;
  name: string;
};

interface TeamState {
  activeTeam: Team | null;
  setActiveTeam: (team: Team | null) => void;
}

export const useTeamStore = create<TeamState>((set) => ({
  activeTeam: null,
  setActiveTeam: (team) => set({ activeTeam: team }),
}));