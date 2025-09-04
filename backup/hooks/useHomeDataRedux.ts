import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchBenefits,
  fetchProcessSteps,
  fetchTestimonials,
  fetchHeroSlides
} from '../store/features/home';
import { setApiConnected, addNotification } from '../store/features/ui';

export const useHomeDataRedux = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const benefits = useAppSelector((state) => state.benefits.benefits);
  const benefitsLoading = useAppSelector((state) => state.benefits.loading);
  const benefitsError = useAppSelector((state) => state.benefits.error);
  
  const processSteps = useAppSelector((state) => state.processSteps.processSteps);
  const processStepsLoading = useAppSelector((state) => state.processSteps.loading);
  const processStepsError = useAppSelector((state) => state.processSteps.error);
  
  const testimonials = useAppSelector((state) => state.testimonials.testimonials);
  const testimonialsLoading = useAppSelector((state) => state.testimonials.loading);
  const testimonialsError = useAppSelector((state) => state.testimonials.error);
  
  const heroSlides = useAppSelector((state) => state.heroSlides.heroSlides);
  const heroSlidesLoading = useAppSelector((state) => state.heroSlides.loading);
  const heroSlidesError = useAppSelector((state) => state.heroSlides.error);
  
  const apiConnected = useAppSelector((state) => state.ui.apiConnected);

  // Combined loading state
  const isLoading = benefitsLoading || processStepsLoading || testimonialsLoading || heroSlidesLoading;
  
  // Combined error state
  const hasError = !!(benefitsError || processStepsError || testimonialsError || heroSlidesError);
  const errorMessage = benefitsError || processStepsError || testimonialsError || heroSlidesError;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Dispatch all fetch actions
        const results = await Promise.allSettled([
          dispatch(fetchBenefits()).unwrap(),
          dispatch(fetchProcessSteps()).unwrap(),
          dispatch(fetchTestimonials()).unwrap(),
          dispatch(fetchHeroSlides()).unwrap(),
        ]);

        // Check if any requests failed
        const failedRequests = results.filter(result => result.status === 'rejected');
        
        if (failedRequests.length > 0) {
          dispatch(setApiConnected(false));
          dispatch(addNotification({
            type: 'warning',
            message: 'Some data could not be loaded from the server. Using cached data.',
            duration: 5000,
          }));
        } else {
          dispatch(setApiConnected(true));
        }
      } catch (error) {
        dispatch(setApiConnected(false));
        dispatch(addNotification({
          type: 'error',
          message: 'Failed to connect to the server. Using offline data.',
          duration: 5000,
        }));
      }
    };

    fetchData();
  }, [dispatch]);

  return {
    data: {
      benefits,
      processSteps,
      testimonials,
      heroSlides,
    },
    loading: isLoading,
    error: hasError ? errorMessage : null,
    apiConnected,
    refetch: () => {
      dispatch(fetchBenefits());
      dispatch(fetchProcessSteps());
      dispatch(fetchTestimonials());
      dispatch(fetchHeroSlides());
    },
  };
};
