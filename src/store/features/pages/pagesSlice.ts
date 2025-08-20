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
      console.log('fetchPageBySlug called with slug:', slug);
      const response = await apiService.getPageBySlug(slug);
      console.log('fetchPageBySlug API response:', response);
      if (response.status === 'success' && response.data) {
        console.log('fetchPageBySlug success, returning data:', response.data);
        return response.data;
      }
      console.log('fetchPageBySlug failed, throwing error:', response.message);
      throw new Error(response.message || 'Page not found');
    } catch (error) {
      console.log('fetchPageBySlug caught error:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
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
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPageBySlug.fulfilled, (state, action: PayloadAction<Page>) => {
        state.loading = false;
        state.currentPage = action.payload;
        state.error = null;
      })
      .addCase(fetchPageBySlug.rejected, (state, action) => {
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
