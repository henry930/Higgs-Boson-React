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
    icon: "💰",
    order: 1,
    active: true,
    created_at: "",
    updated_at: ""
  },
  {
    id: 2,
    title: "75% Faster Delivery", 
    description: "Deploy large-scale applications in weeks, not months, with our AI-accelerated development process.",
    icon: "⚡",
    order: 2,
    active: true,
    created_at: "",
    updated_at: ""
  },
  {
    id: 3,
    title: "Lean Expert Teams",
    description: "Achieve superior results with smaller teams focused on strategy, management, and quality oversight.",
    icon: "👥",
    order: 3,
    active: true,
    created_at: "",
    updated_at: ""
  },
  {
    id: 4,
    title: "Enterprise Quality",
    description: "AI-assisted development with human expertise ensures exceptional quality and reliability.",
    icon: "⭐",
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
export const fetchBenefits = createAsyncThunk(
  'benefits/fetchBenefits',
  async (_, { rejectWithValue }) => {
    console.log('🚀 fetchBenefits thunk called');
    try {
      console.log('📡 Calling apiService.getBenefits()');
      const response = await apiService.getBenefits();
      console.log('📊 getBenefits response:', response);
      if (response.status === 'success' && response.data) {
        console.log('✅ Benefits fetch successful:', response.data);
        return response.data;
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
  async (benefit: Omit<Benefit, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
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
      .addCase(fetchBenefits.fulfilled, (state, action: PayloadAction<Benefit[]>) => {
        state.loading = false;
        state.benefits = action.payload;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchBenefits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
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
