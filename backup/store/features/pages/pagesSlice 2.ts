import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../../services/apiService';
import type { Page } from '../../../types';

interface PagesState {
  pages: Page[];
  currentPage: Page | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: PagesState = {
  pages: [],
  currentPage: null,
  loading: false,
  error: null,
  lastFetched: null,
};

// Async thunks
export const fetchPages = createAsyncThunk(
  'pages/fetchPages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getPages();
      if (response.status === 'success' && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch pages');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const fetchPageBySlug = createAsyncThunk(
  'pages/fetchPageBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      // Use direct fetch since it's proven to work reliably
      const response = await fetch(`http://127.0.0.1:8000/api/pages/slug/${encodeURIComponent(slug)}/`);
      
      if (response.status === 404) {
        return rejectWithValue(`Page with slug "${slug}" not found`);
      }
      
      if (!response.ok) {
        return rejectWithValue(`Server error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'success' && data.data) {
        return data.data;
      } else {
        return rejectWithValue(data.message || `Page "${slug}" not found`);
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return rejectWithValue('Unable to connect to server');
      }
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }
);

export const createPage = createAsyncThunk(
  'pages/createPage',
  async (page: Omit<Page, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>, { rejectWithValue }) => {
    try {
      const response = await apiService.createPage(page);
      if (response.status === 'success' && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to create page');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const updatePage = createAsyncThunk(
  'pages/updatePage',
  async ({ id, page }: { id: number; page: Partial<Page> }, { rejectWithValue }) => {
    try {
      const response = await apiService.updatePage(id, page);
      if (response.status === 'success' && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to update page');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const deletePage = createAsyncThunk(
  'pages/deletePage',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await apiService.deletePage(id);
      if (response.status === 'success') {
        return id;
      }
      throw new Error(response.message || 'Failed to delete page');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const incrementPageViews = createAsyncThunk(
  'pages/incrementPageViews',
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await apiService.incrementPageViews(slug);
      if (response.status === 'success' && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to increment page views');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const pagesSlice = createSlice({
  name: 'pages',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPage: (state) => {
      state.currentPage = null;
    },
    resetPages: (state) => {
      state.pages = [];
      state.currentPage = null;
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch pages
      .addCase(fetchPages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPages.fulfilled, (state, action: PayloadAction<Page[]>) => {
        state.loading = false;
        state.pages = action.payload;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchPages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch page by slug
      .addCase(fetchPageBySlug.pending, (state) => {
        console.log('🔄 Redux: fetchPageBySlug.pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPageBySlug.fulfilled, (state, action: PayloadAction<Page>) => {
        console.log('✅ Redux: fetchPageBySlug.fulfilled with payload:', action.payload);
        state.loading = false;
        state.currentPage = action.payload;
        state.error = null;
      })
      .addCase(fetchPageBySlug.rejected, (state, action) => {
        console.log('❌ Redux: fetchPageBySlug.rejected with error:', action.payload);
        state.loading = false;
        state.error = action.payload as string;
        state.currentPage = null;
      })
      // Create page
      .addCase(createPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPage.fulfilled, (state, action: PayloadAction<Page>) => {
        state.loading = false;
        state.pages.push(action.payload);
        state.error = null;
      })
      .addCase(createPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update page
      .addCase(updatePage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePage.fulfilled, (state, action: PayloadAction<Page>) => {
        state.loading = false;
        const index = state.pages.findIndex((p: Page) => p.id === action.payload.id);
        if (index !== -1) {
          state.pages[index] = action.payload;
        }
        if (state.currentPage?.id === action.payload.id) {
          state.currentPage = action.payload;
        }
        state.error = null;
      })
      .addCase(updatePage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete page
      .addCase(deletePage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePage.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.pages = state.pages.filter((p: Page) => p.id !== action.payload);
        if (state.currentPage?.id === action.payload) {
          state.currentPage = null;
        }
        state.error = null;
      })
      .addCase(deletePage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Increment page views
      .addCase(incrementPageViews.fulfilled, (state, action: PayloadAction<Page>) => {
        if (state.currentPage?.id === action.payload.id) {
          state.currentPage = action.payload;
        }
        const index = state.pages.findIndex((p: Page) => p.id === action.payload.id);
        if (index !== -1) {
          state.pages[index] = action.payload;
        }
      });
  },
});

export const { clearError, clearCurrentPage, resetPages } = pagesSlice.actions;
export default pagesSlice.reducer;
