import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
  fetchBenefits,
  createBenefit,
  updateBenefit,
  deleteBenefit,
  clearBenefitsError,
  resetBenefits,
  fetchProcessSteps,
  createProcessStep,
  updateProcessStep,
  deleteProcessStep,
  clearProcessStepsError,
  resetProcessSteps,
  fetchTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  clearTestimonialsError,
  resetTestimonials,
  fetchHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  clearHeroSlidesError,
  resetHeroSlides
} from '../../store/features/home';

// Benefits hook
export const useBenefits = () => {
  const dispatch = useAppDispatch();
  const benefits = useAppSelector((state) => state.benefits.benefits);
  const loading = useAppSelector((state) => state.benefits.loading);
  const error = useAppSelector((state) => state.benefits.error);
  const lastFetched = useAppSelector((state) => state.benefits.lastFetched);

  return {
    benefits,
    loading,
    error,
    lastFetched,
    actions: {
      fetch: () => dispatch(fetchBenefits()),
      create: (benefit: any) => dispatch(createBenefit(benefit)),
      update: (id: number, benefit: any) => dispatch(updateBenefit({ id, benefit })),
      delete: (id: number) => dispatch(deleteBenefit(id)),
      clearError: () => dispatch(clearBenefitsError()),
      reset: () => dispatch(resetBenefits()),
    },
  };
};

// Process Steps hook
export const useProcessSteps = () => {
  const dispatch = useAppDispatch();
  const processSteps = useAppSelector((state) => state.processSteps.processSteps);
  const loading = useAppSelector((state) => state.processSteps.loading);
  const error = useAppSelector((state) => state.processSteps.error);
  const lastFetched = useAppSelector((state) => state.processSteps.lastFetched);

  return {
    processSteps,
    loading,
    error,
    lastFetched,
    actions: {
      fetch: () => dispatch(fetchProcessSteps()),
      create: (step: any) => dispatch(createProcessStep(step)),
      update: (id: number, step: any) => dispatch(updateProcessStep({ id, step })),
      delete: (id: number) => dispatch(deleteProcessStep(id)),
      clearError: () => dispatch(clearProcessStepsError()),
      reset: () => dispatch(resetProcessSteps()),
    },
  };
};

// Testimonials hook
export const useTestimonials = () => {
  const dispatch = useAppDispatch();
  const testimonials = useAppSelector((state) => state.testimonials.testimonials);
  const loading = useAppSelector((state) => state.testimonials.loading);
  const error = useAppSelector((state) => state.testimonials.error);
  const lastFetched = useAppSelector((state) => state.testimonials.lastFetched);

  return {
    testimonials,
    loading,
    error,
    lastFetched,
    actions: {
      fetch: () => dispatch(fetchTestimonials()),
      create: (testimonial: any) => dispatch(createTestimonial(testimonial)),
      update: (id: number, testimonial: any) => dispatch(updateTestimonial({ id, testimonial })),
      delete: (id: number) => dispatch(deleteTestimonial(id)),
      clearError: () => dispatch(clearTestimonialsError()),
      reset: () => dispatch(resetTestimonials()),
    },
  };
};

// Hero Slides hook
export const useHeroSlides = () => {
  const dispatch = useAppDispatch();
  const heroSlides = useAppSelector((state) => state.heroSlides.heroSlides);
  const loading = useAppSelector((state) => state.heroSlides.loading);
  const error = useAppSelector((state) => state.heroSlides.error);
  const lastFetched = useAppSelector((state) => state.heroSlides.lastFetched);

  return {
    heroSlides,
    loading,
    error,
    lastFetched,
    actions: {
      fetch: () => dispatch(fetchHeroSlides()),
      create: (slide: any) => dispatch(createHeroSlide(slide)),
      update: (id: number, slide: any) => dispatch(updateHeroSlide({ id, slide })),
      delete: (id: number) => dispatch(deleteHeroSlide(id)),
      clearError: () => dispatch(clearHeroSlidesError()),
      reset: () => dispatch(resetHeroSlides()),
    },
  };
};
