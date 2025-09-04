// Home page feature exports
export { default as benefitsReducer } from './benefitsSlice';
export { default as heroSlidesReducer } from './heroSlidesSlice';
export { default as testimonialsReducer } from './testimonialsSlice';
export { default as processStepsReducer } from './processStepsSlice';

// Export specific actions with prefixes to avoid conflicts
export {
  fetchBenefits,
  createBenefit,
  updateBenefit,
  deleteBenefit,
  clearError as clearBenefitsError,
  resetBenefits
} from './benefitsSlice';

export {
  fetchHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  clearError as clearHeroSlidesError,
  resetHeroSlides
} from './heroSlidesSlice';

export {
  fetchTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  clearError as clearTestimonialsError,
  resetTestimonials
} from './testimonialsSlice';

export {
  fetchProcessSteps,
  createProcessStep,
  updateProcessStep,
  deleteProcessStep,
  clearError as clearProcessStepsError,
  resetProcessSteps
} from './processStepsSlice';
