import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Define types for team members
export interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  order: number;
  active: boolean;
}

interface TeamState {
  teamMembers: TeamMember[];
  loading: boolean;
  error: string | null;
}

// Static data for now - can be moved to API later
const staticTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Dr. Sarah Chen',
    role: 'Chief AI Officer',
    image: '👩‍💼',
    bio: 'Former Google AI researcher with 15+ years in machine learning and enterprise AI solutions.',
    order: 1,
    active: true,
  },
  {
    id: 2,
    name: 'Marcus Rodriguez',
    role: 'Lead Full-Stack Developer',
    image: '👨‍💻',
    bio: 'Full-stack architect specializing in scalable web applications and cloud infrastructure.',
    order: 2,
    active: true,
  },
  {
    id: 3,
    name: 'Dr. Emily Watson',
    role: 'Data Science Director',
    image: '👩‍🔬',
    bio: 'PhD in Statistics, expert in predictive analytics and business intelligence solutions.',
    order: 3,
    active: true,
  },
  {
    id: 4,
    name: 'James Kim',
    role: 'DevOps Engineer',
    image: '👨‍🔧',
    bio: 'Cloud infrastructure specialist with expertise in AWS, Azure, and containerization.',
    order: 4,
    active: true,
  },
];

const initialState: TeamState = {
  teamMembers: staticTeamMembers,
  loading: false,
  error: null,
};

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateTeamMember: (state, action: PayloadAction<TeamMember>) => {
      const index = state.teamMembers.findIndex((m: TeamMember) => m.id === action.payload.id);
      if (index !== -1) {
        state.teamMembers[index] = action.payload;
      }
    },
    addTeamMember: (state, action: PayloadAction<TeamMember>) => {
      state.teamMembers.push(action.payload);
    },
    removeTeamMember: (state, action: PayloadAction<number>) => {
      state.teamMembers = state.teamMembers.filter((m: TeamMember) => m.id !== action.payload);
    },
  },
});

export const { setLoading, setError, clearError, updateTeamMember, addTeamMember, removeTeamMember } = teamSlice.actions;
export default teamSlice.reducer;
