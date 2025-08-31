import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../../services/apiService';
import type { Benefit } from '../../../types';

interface BenefitsState {
  benefits: Benefit[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

// Fallback data
const fallbackBenefits: Benefit[] = [
  {
    id: 1,
    title: "70% Cost Reduction",
    description: "Dramatically reduce development costs while maintaining enterprise-quality standards and faster delivery times.",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
    </svg>`,
    order: 1,
    active: true,
    created_at: "",
    updated_at: ""
  },
  {
    id: 2,
    title: "75% Faster Delivery", 
    description: "Deploy large-scale applications in weeks, not months, with our AI-accelerated development process.",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
    </svg>`,
    order: 2,
    active: true,
    created_at: "",
    updated_at: ""
  },
  {
    id: 3,
    title: "Lean Expert Teams",
    description: "Achieve superior results with smaller teams focused on strategy, management, and quality oversight.",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63c-.34-1.02-1.31-1.74-2.46-1.74s-2.12.72-2.46 1.74L12.5 16H15v6h5zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9V9.5c0-.28-.22-.5-.5-.5S8 9.22 8 9.5V15H6.5v7h3zM12 13.5c-.28 0-.5.22-.5.5v8h3v-8c0-.28-.22-.5-.5-.5z"/>
    </svg>`,
    order: 3,
    active: true,
    created_at: "",
    updated_at: ""
  },
  {
    id: 4,
    title: "Enterprise Quality",
    description: "AI-assisted development with human expertise ensures exceptional quality and reliability.",
    icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>`,
    order: 4,
    active: true,
    created_at: "",
    updated_at: ""
  }
];

const initialState: BenefitsState = {
  benefits: fallbackBenefits,
  loading: false,
  error: null,
  lastFetched: null,
};

// Async thunks
export const fetchBenefits = createAsyncThunk<Benefit[]>(
  'benefits/fetchBenefits',
  async (_, { rejectWithValue }) => {
    console.log('🚀 fetchBenefits thunk called');
    try {
      console.log('📡 Calling apiService.getBenefits()');
      const response = await apiService.getBenefits();
      console.log('📊 getBenefits response:', response);
      // Check for our standardized API response format
      if (response.status === 'success' && response.data) {
        console.log('✅ Benefits fetch successful:', response.data);
        return response.data as Benefit[];
      }
      console.log('❌ Benefits fetch failed - invalid response:', response);
      throw new Error(response.message || 'Failed to fetch benefits');
    } catch (error) {
      console.log('💥 Benefits fetch error:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const createBenefit = createAsyncThunk(
  'benefits/createBenefit',
  async (benefit: Omit<Benefit, 'id' | 'created_at' | 'updated_at'>, { rejectWithValue }) => {
    try {
      const response = await apiService.createBenefit(benefit);
      if (response.status === 'success' && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to create benefit');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const updateBenefit = createAsyncThunk(
  'benefits/updateBenefit',
  async ({ id, benefit }: { id: number; benefit: Partial<Benefit> }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateBenefit(id, benefit);
      if (response.status === 'success' && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to update benefit');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const deleteBenefit = createAsyncThunk(
  'benefits/deleteBenefit',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await apiService.deleteBenefit(id);
      if (response.status === 'success') {
        return id;
      }
      throw new Error(response.message || 'Failed to delete benefit');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const benefitsSlice = createSlice({
  name: 'benefits',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetBenefits: (state) => {
      state.benefits = [];
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch benefits
      .addCase(fetchBenefits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBenefits.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure payload is an array before setting benefits
        state.benefits = Array.isArray(action.payload) ? action.payload : fallbackBenefits;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchBenefits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Keep fallback data when API fails
        if (!Array.isArray(state.benefits) || state.benefits.length === 0) {
          state.benefits = fallbackBenefits;
        }
      })
      // Create benefit
      .addCase(createBenefit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBenefit.fulfilled, (state, action: PayloadAction<Benefit>) => {
        state.loading = false;
        state.benefits.push(action.payload);
        state.error = null;
      })
      .addCase(createBenefit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update benefit
      .addCase(updateBenefit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBenefit.fulfilled, (state, action: PayloadAction<Benefit>) => {
        state.loading = false;
        const index = state.benefits.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.benefits[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateBenefit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete benefit
      .addCase(deleteBenefit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBenefit.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.benefits = state.benefits.filter(b => b.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteBenefit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetBenefits } = benefitsSlice.actions;
export default benefitsSlice.reducer;
