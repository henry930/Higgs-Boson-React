import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../../services/apiService';

// Define types for services based on Django API
export interface Service {
  id: number;
  title: string;
  description: string;
  short_description: string;
  icon: string;
  features: string | string[];
  price_range: string;
  duration: string;
  category: string;
  order: number;
  featured: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface ServicesState {
  services: Service[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: ServicesState = {
  services: [],
  loading: false,
  error: null,
  lastFetched: null,
};

// Async thunks
export const fetchServices = createAsyncThunk<Service[]>(
  'services/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getServices();
      if (response.status === 'success' && response.data) {
        return response.data as Service[];
      }
      throw new Error(response.message || 'Failed to fetch services');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const createService = createAsyncThunk<Service, Omit<Service, 'id' | 'created_at' | 'updated_at'>>(
  'services/createService',
  async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>, { rejectWithValue }) => {
    try {
      const response = await apiService.createService(service);
      if (response.status === 'success' && response.data) {
        return response.data as Service;
      }
      throw new Error(response.message || 'Failed to create service');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const updateService = createAsyncThunk<Service, { id: number; service: Partial<Service> }>(
  'services/updateService',
  async ({ id, service }: { id: number; service: Partial<Service> }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateService(id, service);
      if (response.status === 'success' && response.data) {
        return response.data as Service;
      }
      throw new Error(response.message || 'Failed to update service');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const deleteService = createAsyncThunk(
  'services/deleteService',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await apiService.deleteService(id);
      if (response.status === 'success') {
        return id;
      }
      throw new Error(response.message || 'Failed to delete service');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const servicesSlice = createSlice({
  name: 'services',
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
    clearServices: (state) => {
      state.services = [];
      state.lastFetched = null;
    },
    resetServices: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch services
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create service
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        state.services.push(action.payload);
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update service
      .addCase(updateService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.services.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.services[index] = action.payload;
        }
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete service
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false;
        state.services = state.services.filter(s => s.id !== action.payload);
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setLoading, setError, clearError, clearServices, resetServices } = servicesSlice.actions;
export default servicesSlice.reducer;
