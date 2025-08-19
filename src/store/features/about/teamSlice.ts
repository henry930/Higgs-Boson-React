import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../../services/apiService';

// Define types for team members based on Django API
export interface TeamMember {
  id: number;
  name: string;
  position: string;
  bio: string;
  image_url: string;
  linkedin_url: string;
  twitter_url: string;
  email: string;
  specialties: string;
  years_experience: number;
  education: string;
  order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface TeamState {
  teamMembers: TeamMember[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: TeamState = {
  teamMembers: [],
  loading: false,
  error: null,
  lastFetched: null,
};

// Async thunks
export const fetchTeamMembers = createAsyncThunk(
  'team/fetchTeamMembers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getTeamMembers();
      if (response.status === 'success' && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch team members');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const createTeamMember = createAsyncThunk(
  'team/createTeamMember',
  async (member: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>, { rejectWithValue }) => {
    try {
      const response = await apiService.createTeamMember(member);
      if (response.status === 'success' && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to create team member');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const updateTeamMember = createAsyncThunk(
  'team/updateTeamMember',
  async ({ id, member }: { id: number; member: Partial<TeamMember> }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateTeamMember(id, member);
      if (response.status === 'success' && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to update team member');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const deleteTeamMember = createAsyncThunk(
  'team/deleteTeamMember',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await apiService.deleteTeamMember(id);
      if (response.status === 'success') {
        return id;
      }
      throw new Error(response.message || 'Failed to delete team member');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

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
    clearTeamMembers: (state) => {
      state.teamMembers = [];
      state.lastFetched = null;
    },
    resetTeam: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch team members
      .addCase(fetchTeamMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.teamMembers = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create team member
      .addCase(createTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeamMember.fulfilled, (state, action) => {
        state.loading = false;
        state.teamMembers.push(action.payload);
      })
      .addCase(createTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update team member
      .addCase(updateTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeamMember.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.teamMembers.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.teamMembers[index] = action.payload;
        }
      })
      .addCase(updateTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete team member
      .addCase(deleteTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTeamMember.fulfilled, (state, action) => {
        state.loading = false;
        state.teamMembers = state.teamMembers.filter(m => m.id !== action.payload);
      })
      .addCase(deleteTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setLoading, setError, clearError, clearTeamMembers, resetTeam } = teamSlice.actions;
export default teamSlice.reducer;
