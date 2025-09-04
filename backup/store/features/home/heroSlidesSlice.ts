import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../../services/apiService';
import type { HeroSlide } from '../../../types';

interface HeroSlidesState {
  heroSlides: HeroSlide[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: HeroSlidesState = {
  heroSlides: [],
  loading: false,
  error: null,
  lastFetched: null,
};

// Async thunks
export const fetchHeroSlides = createAsyncThunk<HeroSlide[]>(
  'heroSlides/fetchHeroSlides',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getHeroSlides();
      if (response.status === 'success' && response.data) {
        return response.data as HeroSlide[];
      }
      throw new Error(response.message || 'Failed to fetch hero slides');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const createHeroSlide = createAsyncThunk(
  'heroSlides/createHeroSlide',
  async (heroSlide: Omit<HeroSlide, 'id' | 'created_at' | 'updated_at'>, { rejectWithValue }) => {
    try {
      const response = await apiService.createHeroSlide(heroSlide);
      if (response.status === 'success' && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to create hero slide');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const updateHeroSlide = createAsyncThunk(
  'heroSlides/updateHeroSlide',
  async ({ id, heroSlide }: { id: number; heroSlide: Partial<HeroSlide> }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateHeroSlide(id, heroSlide);
      if (response.status === 'success' && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to update hero slide');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const deleteHeroSlide = createAsyncThunk(
  'heroSlides/deleteHeroSlide',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await apiService.deleteHeroSlide(id);
      if (response.status === 'success') {
        return id;
      }
      throw new Error(response.message || 'Failed to delete hero slide');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const heroSlidesSlice = createSlice({
  name: 'heroSlides',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetHeroSlides: (state) => {
      state.heroSlides = [];
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch hero slides
      .addCase(fetchHeroSlides.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHeroSlides.fulfilled, (state, action) => {
        state.loading = false;
        state.heroSlides = action.payload;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchHeroSlides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create hero slide
      .addCase(createHeroSlide.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHeroSlide.fulfilled, (state, action: PayloadAction<HeroSlide>) => {
        state.loading = false;
        state.heroSlides.push(action.payload);
        state.error = null;
      })
      .addCase(createHeroSlide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update hero slide
      .addCase(updateHeroSlide.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHeroSlide.fulfilled, (state, action: PayloadAction<HeroSlide>) => {
        state.loading = false;
        const index = state.heroSlides.findIndex((s: HeroSlide) => s.id === action.payload.id);
        if (index !== -1) {
          state.heroSlides[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateHeroSlide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete hero slide
      .addCase(deleteHeroSlide.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHeroSlide.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.heroSlides = state.heroSlides.filter((s: HeroSlide) => s.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteHeroSlide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetHeroSlides } = heroSlidesSlice.actions;
export default heroSlidesSlice.reducer;
