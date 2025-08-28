import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './HeroCarousel.module.scss';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  backgroundImage: string;
  primaryButton: {
    text: string;
    action: () => void;
  };
  secondaryButton: {
    text: string;
    link: string;
  };
  stats: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  if (!slides.length) return null;

  const currentSlideData = slides[currentSlide];

  return (
    <section 
      className={styles.heroCarousel}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`${styles.heroBackground} ${index === currentSlide ? styles.active : ''}`}
          style={{ backgroundImage: `url(${slide.backgroundImage})` }}
        />
      ))}

      {/* Overlay */}
      <div className={styles.heroOverlay} />

      {/* Content */}
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            {currentSlideData.title.split(' ').map((word, index, array) => {
              if (word.includes('AI-powered') || word.includes('in-house') || word.includes('innovative') || word.includes('transformative')) {
                return (
                  <span key={index} className={styles.heroAccent}>
                    {word}{index < array.length - 1 ? ' ' : ''}
                  </span>
                );
              }
              return word + (index < array.length - 1 ? ' ' : '');
            })}
          </h1>
          
          <p className={styles.heroSubtitle}>
            {currentSlideData.subtitle}
          </p>
          
          <div className={styles.heroButtons}>
            <button 
              onClick={currentSlideData.primaryButton.action}
              className={styles.primaryButton}
            >
              {currentSlideData.primaryButton.text}
              <svg className={styles.buttonIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
            <Link to={currentSlideData.secondaryButton.link} className={styles.secondaryButton}>
              {currentSlideData.secondaryButton.text}
            </Link>
          </div>
          
          <div className={styles.heroStats}>
            <p className={styles.heroStatsText} dangerouslySetInnerHTML={{ __html: currentSlideData.stats }} />
          </div>
        </div>

        {/* Carousel Controls */}
        <div className={styles.carouselControls}>
          <button 
            className={styles.carouselButton}
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          
          <button 
            className={styles.carouselButton}
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>

        {/* Slide Indicators */}
        <div className={styles.slideIndicators}>
          {slides.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${index === currentSlide ? styles.active : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
