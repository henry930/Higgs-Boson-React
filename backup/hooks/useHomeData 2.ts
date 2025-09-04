import { useState, useEffect } from 'react';
import type { Benefit, ProcessStep, Testimonial, HeroSlide } from '../types';
import { dataService } from '../services/dataService';
import { fallbackData } from '../data/fallbackData';

interface UseHomeDataReturn {
  benefits: Benefit[];
  processSteps: ProcessStep[];
  testimonials: Testimonial[];
  heroSlides: HeroSlide[];
  loading: boolean;
  error: string | null;
  isUsingFallback: boolean;
}

export const useHomeData = (): UseHomeDataReturn => {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setIsUsingFallback(false);

        // Fetch all data in parallel with timeout
        const [benefitsRes, processRes, testimonialsRes, heroRes] = await Promise.all([
          dataService.getBenefits(),
          dataService.getProcessSteps(),
          dataService.getFeaturedTestimonials(),
          dataService.getHeroSlides()
        ]);

        // Check if any API calls failed
        const hasErrors = [benefitsRes, processRes, testimonialsRes, heroRes]
          .some(res => res.status === 'error');

        if (hasErrors) {
          console.warn('API calls failed, using fallback data');
          setIsUsingFallback(true);
          setBenefits(fallbackData.benefits);
          setProcessSteps(fallbackData.processSteps);
          setTestimonials(fallbackData.testimonials);
          setHeroSlides(fallbackData.heroSlides);
        } else {
          setBenefits(benefitsRes.data);
          setProcessSteps(processRes.data);
          setTestimonials(testimonialsRes.data);
          setHeroSlides(heroRes.data);
        }
      } catch (err) {
        console.warn('Failed to load data from API, using fallback data:', err);
        setIsUsingFallback(true);
        setBenefits(fallbackData.benefits);
        setProcessSteps(fallbackData.processSteps);
        setTestimonials(fallbackData.testimonials);
        setHeroSlides(fallbackData.heroSlides);
        setError('Using offline content');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    benefits,
    processSteps,
    testimonials,
    heroSlides,
    loading,
    error,
    isUsingFallback
  };
};
