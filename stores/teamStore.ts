import { create } from 'zustand';

export type TeamMember = {
  id: string;
  teamId: string;
  userId: string;
  role: 'driver' | 'spotter' | 'crew';
  joinedAt: Date;
};

export type Team = {
  id: string;
  name: string;
  type: 'pro' | 'amateur';
  role: string;
  memberCount: number;
  createdAt: Date;
  createdBy: string;
};

interface TeamState {
  teams: Team[];
  members: TeamMember[];
  activeTeam: Team | null;
  addTeam: (team: Omit<Team, 'id' | 'createdAt' | 'memberCount' | 'createdBy'>, userId: string) => void;
  removeTeam: (id: string) => void;
  setActiveTeam: (team: Team | null) => void;
  getTeam: (id: string) => Team | undefined;
  addMember: (member: Omit<TeamMember, 'id' | 'joinedAt'>) => void;
  removeMember: (teamId: string, userId: string) => void;
  getTeamMembers: (teamId: string) => TeamMember[];
  updateTeamMemberCount: (teamId: string) => void;
}

export const useTeamStore = create<TeamState>((set, get) => ({
  teams: [],
  members: [],
  activeTeam: null,
  addTeam: (team, userId) => {
    const newTeam: Team = {
      ...team,
      id: Date.now().toString(),
      createdAt: new Date(),
      createdBy: userId,
      memberCount: 1, // Start with creator as first member
    };

    set((state) => ({
      teams: [...state.teams, newTeam],
    }));

    // Automatically add creator as a member
    get().addMember({
      teamId: newTeam.id,
      userId,
      role: team.role,
    });
  },
  removeTeam: (id) =>
    set((state) => ({
      teams: state.teams.filter((team) => team.id !== id),
      members: state.members.filter((member) => member.teamId !== id),
      activeTeam: state.activeTeam?.id === id ? null : state.activeTeam,
    })),
  setActiveTeam: (team) => set({ activeTeam: team }),
  getTeam: (id) => get().teams.find((team) => team.id === id),
  addMember: (member) => {
    const newMember: TeamMember = {
      ...member,
      id: Date.now().toString(),
      joinedAt: new Date(),
    };

    set((state) => ({
      members: [...state.members, newMember],
    }));

    get().updateTeamMemberCount(member.teamId);
  },
  removeMember: (teamId, userId) => {
    set((state) => ({
      members: state.members.filter(
        (member) => !(member.teamId === teamId && member.userId === userId)
      ),
    }));

    get().updateTeamMemberCount(teamId);
  },
  getTeamMembers: (teamId) => 
    get().members.filter((member) => member.teamId === teamId),
  updateTeamMemberCount: (teamId) => {
    const memberCount = get().members.filter((member) => member.teamId === teamId).length;
    
    set((state) => ({
      teams: state.teams.map((team) =>
        team.id === teamId ? { ...team, memberCount } : team
      ),
      activeTeam: state.activeTeam?.id === teamId
        ? { ...state.activeTeam, memberCount }
        : state.activeTeam,
    }));
  },
}));