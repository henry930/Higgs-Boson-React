import { Link } from 'react-router-dom';
import BenefitCard from '../../components/BenefitCard/BenefitCard';
import Carousel from '../../components/Carousel/Carousel';
import { useHomeDataRedux } from '../../hooks/useHomeDataRedux';
import { useAppSelector } from '../../store/hooks';
import styles from './Home.module.scss';

const Home = () => {
  const { data, loading, error, apiConnected } = useHomeDataRedux();
  const { benefits, processSteps, testimonials, heroSlides } = data;
  
  // Debug logging
  console.log('Home component data:', { benefits, processSteps, testimonials, heroSlides });
  console.log('Home component state:', { loading, error, apiConnected });
  
  // Show notification for offline mode
  const isUsingFallback = !apiConnected;

  // Convert data for carousel format
  const testimonialSlides = testimonials.map(testimonial => ({
    id: testimonial.id.toString(),
    content: (
      <div className={styles.testimonial}>
        <div className={styles.testimonialContent}>
          <p>"{testimonial.quote}"</p>
          <div className={styles.testimonialAuthor}>
            <div className={styles.authorInfo}>
              <h4>{testimonial.author_name}</h4>
              <span>{testimonial.author_title}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }));

  const heroCarouselSlides = heroSlides.map(slide => ({
    id: slide.id.toString(),
    backgroundClass: slide.background_class,
    content: (
      <div className={styles.heroSlide}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            {slide.title}
          </h1>
          <p className={styles.heroSubtitle}>
            {slide.subtitle}
          </p>
          <div className={styles.heroButtons}>
            <Link to={slide.primary_button_link} className={styles.primaryButton}>
              {slide.primary_button_text}
            </Link>
            <Link to={slide.secondary_button_link} className={styles.secondaryButton}>
              {slide.secondary_button_text}
            </Link>
          </div>
        </div>
      </div>
    )
  }));

  if (loading) {
    return (
      <div className={styles.home}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.home}>
        <div className={styles.errorContainer}>
          <h2>Error Loading Content</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.home}>
      {isUsingFallback && (
        <div className={styles.fallbackNotice}>
          <p>⚠️ Using offline content - some features may be limited</p>
        </div>
      )}
      <section className={styles.heroSection}>
        <Carousel 
          items={heroCarouselSlides}
          autoPlay={true}
          autoPlayInterval={8000}
          showDots={true}
          showArrows={true}
          className={styles.heroCarousel}
        />
      </section>

      <section className={styles.benefitsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Why Choose Higgs Boson Consultancy?
            </h2>
            <p className={styles.sectionSubtitle}>
              The future of software development is here. Experience unprecedented efficiency, quality, and cost-effectiveness.
            </p>
          </div>
          
          <div className={styles.benefitsGrid}>
            {benefits.map((benefit, index) => (
              <BenefitCard
                key={index}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.processSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>How We Transform Your Development</h2>
            <p className={styles.sectionSubtitle}>Our revolutionary approach to software development combines AI efficiency with human expertise</p>
          </div>
          
          <div className={styles.processGrid}>
            {processSteps.map((step, index) => (
              <div key={index} className={styles.processStep}>
                <div className={styles.stepNumber}>{step.number}</div>
                <h4 className={styles.stepTitle}>{step.title}</h4>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.testimonialsSection}>
        <div className="container">
          <div className={styles.testimonialsContent}>
            <h2 className={styles.testimonialsTitle}>What Our Clients Say</h2>
            <p className={styles.testimonialsSubtitle}>
              Don't just take our word for it. Hear from industry leaders who have transformed their businesses with our AI-powered solutions.
            </p>
            <Carousel 
              items={testimonialSlides}
              autoPlay={true}
              autoPlayInterval={6000}
              showDots={true}
              showArrows={true}
              className={styles.testimonialsCarousel}
            />
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Ready to Transform Your Development Process?
            </h2>
            <p className={styles.ctaSubtitle}>
              Join forward-thinking companies that have already revolutionized their software development with our AI-powered approach. Experience faster delivery, lower costs, and superior quality.
            </p>
            <Link to="/contact" className={styles.ctaButton}>
              Start Your Transformation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
