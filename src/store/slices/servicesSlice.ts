import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Define types for services
export interface Service {
  id: number;
  icon: string;
  title: string;
  description: string;
  features: string[];
  order: number;
  active: boolean;
}

interface ServicesState {
  services: Service[];
  loading: boolean;
  error: string | null;
}

// Static data for now - can be moved to API later
const staticServices: Service[] = [
  {
    id: 1,
    icon: '🤖',
    title: 'AI-Powered Development',
    description: 'Leverage artificial intelligence to accelerate your software development process with intelligent code generation, automated testing, and smart optimization.',
    features: ['Code Generation', 'Automated Testing', 'Performance Optimization', 'Bug Detection'],
    order: 1,
    active: true,
  },
  {
    id: 2,
    icon: '💰',
    title: 'Cost-Effective Solutions',
    description: 'Reduce development costs by up to 70% while maintaining high-quality standards through our streamlined AI-assisted development process.',
    features: ['70% Cost Reduction', 'Faster Time-to-Market', 'Reduced Team Size', 'Lower Maintenance'],
    order: 2,
    active: true,
  },
  {
    id: 3,
    icon: '🚀',
    title: 'Rapid Deployment',
    description: 'Deploy large-scale software solutions in weeks, not months, with our accelerated development methodology and expert project management.',
    features: ['75% Faster Delivery', 'Agile Methodology', 'Continuous Integration', 'DevOps Integration'],
    order: 3,
    active: true,
  },
  {
    id: 4,
    icon: '👥',
    title: 'Expert Consultation',
    description: 'Get strategic guidance from our team of senior engineers and AI specialists to ensure your project succeeds from conception to deployment.',
    features: ['Technical Strategy', 'Architecture Review', 'Code Audits', 'Performance Analysis'],
    order: 4,
    active: true,
  },
];

const initialState: ServicesState = {
  services: staticServices,
  loading: false,
  error: null,
};

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
    updateService: (state, action: PayloadAction<Service>) => {
      const index = state.services.findIndex((s: Service) => s.id === action.payload.id);
      if (index !== -1) {
        state.services[index] = action.payload;
      }
    },
    addService: (state, action: PayloadAction<Service>) => {
      state.services.push(action.payload);
    },
    removeService: (state, action: PayloadAction<number>) => {
      state.services = state.services.filter((s: Service) => s.id !== action.payload);
    },
  },
});

export const { setLoading, setError, clearError, updateService, addService, removeService } = servicesSlice.actions;
export default servicesSlice.reducer;
