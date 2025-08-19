import React, { useState, useEffect } from 'react';
import styles from './Carousel.module.scss';

interface CarouselItem {
  id: string;
  content: React.ReactNode;
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
}

const Carousel = ({ 
  items, 
  autoPlay = true, 
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  className = '' 
}: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || items.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === items.length - 1 ? 0 : prevIndex + 1
      );
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, items.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (items.length === 0) return null;

  return (
    <div className={`${styles.carousel} ${className}`}>
      <div className={styles.carouselContainer}>
        <div 
          className={styles.carouselTrack}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item) => (
            <div key={item.id} className={styles.carouselSlide}>
              {item.content}
            </div>
          ))}
        </div>

        {showArrows && items.length > 1 && (
          <>
            <button 
              className={`${styles.carouselArrow} ${styles.arrowLeft}`}
              onClick={goToPrevious}
              aria-label="Previous slide"
            >
              ←
            </button>
            <button 
              className={`${styles.carouselArrow} ${styles.arrowRight}`}
              onClick={goToNext}
              aria-label="Next slide"
            >
              →
            </button>
          </>
        )}
      </div>

      {showDots && items.length > 1 && (
        <div className={styles.carouselDots}>
          {items.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
