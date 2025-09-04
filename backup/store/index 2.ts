import { configureStore } from '@reduxjs/toolkit';

// Import feature reducers
import {
  benefitsReducer,
  heroSlidesReducer,
  testimonialsReducer,
  processStepsReducer
} from './features/home';

import { teamReducer } from './features/about';
import { servicesReducer } from './features/services';
import { uiReducer } from './features/ui';
import pagesReducer from './features/pages/pagesSlice';

export const store = configureStore({
  reducer: {
    // Home page data
    benefits: benefitsReducer,
    processSteps: processStepsReducer,
    testimonials: testimonialsReducer,
    heroSlides: heroSlidesReducer,
    
    // About page data
    team: teamReducer,
    
    // Services page data
    services: servicesReducer,
    
    // Pages data
    pages: pagesReducer,
    
    // UI state
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
