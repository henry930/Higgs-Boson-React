import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../../services/apiService';
import type { ProcessStep } from '../../../types';

interface ProcessStepsState {
  processSteps: ProcessStep[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: ProcessStepsState = {
  processSteps: [],
  loading: false,
  error: null,
  lastFetched: null,
};

// Async thunks
export const fetchProcessSteps = createAsyncThunk(
  'processSteps/fetchProcessSteps',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getProcessSteps();
      if (response.status === 'success' && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch process steps');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const createProcessStep = createAsyncThunk(
  'processSteps/createProcessStep',
  async (step: Omit<ProcessStep, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await apiService.createProcessStep(step);
      if (response.status === 'success' && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to create process step');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const updateProcessStep = createAsyncThunk(
  'processSteps/updateProcessStep',
  async ({ id, step }: { id: number; step: Partial<ProcessStep> }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateProcessStep(id, step);
      if (response.status === 'success' && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to update process step');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const deleteProcessStep = createAsyncThunk(
  'processSteps/deleteProcessStep',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await apiService.deleteProcessStep(id);
      if (response.status === 'success') {
        return id;
      }
      throw new Error(response.message || 'Failed to delete process step');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const processStepsSlice = createSlice({
  name: 'processSteps',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetProcessSteps: (state) => {
      state.processSteps = [];
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch process steps
      .addCase(fetchProcessSteps.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProcessSteps.fulfilled, (state, action: PayloadAction<ProcessStep[]>) => {
        state.loading = false;
        state.processSteps = action.payload;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchProcessSteps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create process step
      .addCase(createProcessStep.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProcessStep.fulfilled, (state, action: PayloadAction<ProcessStep>) => {
        state.loading = false;
        state.processSteps.push(action.payload);
        state.error = null;
      })
      .addCase(createProcessStep.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update process step
      .addCase(updateProcessStep.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProcessStep.fulfilled, (state, action: PayloadAction<ProcessStep>) => {
        state.loading = false;
        const index = state.processSteps.findIndex((s: ProcessStep) => s.id === action.payload.id);
        if (index !== -1) {
          state.processSteps[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProcessStep.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete process step
      .addCase(deleteProcessStep.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProcessStep.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.processSteps = state.processSteps.filter((s: ProcessStep) => s.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteProcessStep.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetProcessSteps } = processStepsSlice.actions;
export default processStepsSlice.reducer;
