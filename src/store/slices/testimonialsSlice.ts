import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/apiService';
import type { Testimonial } from '../../types';

interface TestimonialsState {
  testimonials: Testimonial[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: TestimonialsState = {
  testimonials: [],
  loading: false,
  error: null,
  lastFetched: null,
};

// Async thunks
export const fetchTestimonials = createAsyncThunk<any[]>(
  'testimonials/fetchTestimonials',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getTestimonials();
      if (response.status === 'success' && response.data) {
        return response.data as any[];
      }
      throw new Error(response.message || 'Failed to fetch testimonials');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const createTestimonial = createAsyncThunk(
  'testimonials/createTestimonial',
  async (testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await apiService.createTestimonial(testimonial);
      if (response.status === 'success' && response.data) {
        return response.data as any[];
      }
      throw new Error(response.message || 'Failed to create testimonial');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const updateTestimonial = createAsyncThunk(
  'testimonials/updateTestimonial',
  async ({ id, testimonial }: { id: number; testimonial: Partial<Testimonial> }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateTestimonial(id, testimonial);
      if (response.status === 'success' && response.data) {
        return response.data as any[];
      }
      throw new Error(response.message || 'Failed to update testimonial');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const deleteTestimonial = createAsyncThunk(
  'testimonials/deleteTestimonial',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await apiService.deleteTestimonial(id);
      if (response.status === 'success') {
        return id;
      }
      throw new Error(response.message || 'Failed to delete testimonial');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const testimonialsSlice = createSlice({
  name: 'testimonials',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetTestimonials: (state) => {
      state.testimonials = [];
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch testimonials
      .addCase(fetchTestimonials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        state.testimonials = action.payload;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create testimonial
      .addCase(createTestimonial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTestimonial.fulfilled, (state, action) => {
        state.loading = false;
        state.testimonials.push(action.payload);
        state.error = null;
      })
      .addCase(createTestimonial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update testimonial
      .addCase(updateTestimonial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTestimonial.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.testimonials.findIndex((t: Testimonial) => t.id === action.payload.id);
        if (index !== -1) {
          state.testimonials[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTestimonial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete testimonial
      .addCase(deleteTestimonial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        state.loading = false;
        state.testimonials = state.testimonials.filter((t: Testimonial) => t.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteTestimonial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetTestimonials } = testimonialsSlice.actions;
export default testimonialsSlice.reducer;
