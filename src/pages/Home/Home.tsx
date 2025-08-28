import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useHomeDataRedux } from '../../hooks/useHomeDataRedux';
import GoogleCalendarScheduler from '../../components/GoogleCalendarScheduler';
import HeroCarousel from '../../components/HeroCarousel/HeroCarousel';
import SEO from '../../components/SEO/SEO';
import styles from './Home.module.scss';

const Home = () => {
  const { data, loading, error, apiConnected } = useHomeDataRedux();
  const { benefits, processSteps, testimonials, heroSlides: apiHeroSlides } = data;
  const [showScheduler, setShowScheduler] = useState(false);
  
  // Show notification for offline mode
  const isUsingFallback = !apiConnected;

  // Transform API hero slides to component format, or use fallback
  const heroSlides = apiHeroSlides && apiHeroSlides.length > 0 
    ? apiHeroSlides.map(slide => ({
        id: slide.id,
        title: slide.title,
        subtitle: slide.subtitle || '',
        backgroundImage: slide.background_image || '/images/how-it-works-hero-bg.jpg',
        primaryButton: {
          text: slide.primary_button_text || 'Get Started',
          action: () => slide.primary_button_action === 'schedule' ? setShowScheduler(true) : null
        },
        secondaryButton: {
          text: slide.secondary_button_text || 'Learn More',
          link: slide.secondary_button_link || '/how-it-works'
        },
        stats: slide.stats || ''
      }))
    : [
        // Fallback hero carousel slides data
        {
          id: 1,
          title: "AI-powered development that feels in-house",
          subtitle: "Experience the future of software development. Our AI-driven approach delivers enterprise-grade solutions with the precision and quality of your best in-house team.",
          backgroundImage: "/images/how-it-works-hero-bg.jpg",
          primaryButton: {
            text: "Start Your Project",
            action: () => setShowScheduler(true)
          },
          secondaryButton: {
            text: "Learn More",
            link: "/how-it-works"
          },
          stats: "<strong>Trusted by 100+ innovative companies</strong> • <span class=\"stat-highlight\">70% cost reduction</span> • <span class=\"stat-highlight\">75% faster delivery</span>"
        },
    {
      id: 2,
      title: "Transform Your Business with Innovative AI Solutions",
      subtitle: "Leverage cutting-edge artificial intelligence to automate processes, enhance decision-making, and unlock new opportunities for growth and efficiency.",
      backgroundImage: "/images/step3-strategy.jpg",
      primaryButton: {
        text: "Get AI Consultation",
        action: () => setShowScheduler(true)
      },
      secondaryButton: {
        text: "View Services",
        link: "/services"
      },
      stats: "<strong>AI-First Approach</strong> • <span class=\"stat-highlight\">500+ AI models deployed</span> • <span class=\"stat-highlight\">95% accuracy rate</span>"
    },
    {
      id: 3,
      title: "Build the Future with Transformative Technology",
      subtitle: "From web applications to mobile apps, cloud infrastructure to data analytics - we provide comprehensive technology solutions that scale with your business.",
      backgroundImage: "/images/step4-development.jpg",
      primaryButton: {
        text: "Start Building",
        action: () => setShowScheduler(true)
      },
      secondaryButton: {
        text: "Price Calculator",
        link: "/price-comparison"
      },
      stats: "<strong>Full-Stack Excellence</strong> • <span class=\"stat-highlight\">200+ technologies mastered</span> • <span class=\"stat-highlight\">99.9% uptime</span>"
    }
  ];

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
          <h3>Error Loading Content</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.home}>
      <SEO 
        title="Higgs Boson Consultancy Ltd | AI & Technology Solutions"
        description="Transform your business with our AI-powered solutions. Expert consultancy in machine learning, data science, and digital transformation."
        keywords="AI consultancy, machine learning, data science, technology solutions, digital transformation, artificial intelligence, business automation"
        url="https://higgsboson.tech/"
      />
      {isUsingFallback && (
        <div className={styles.fallbackNotice}>
          <p>⚠️ Using offline content - some features may be limited</p>
        </div>
      )}

      {/* Hero Carousel Section */}
      <HeroCarousel 
        slides={heroSlides}
      />

      {/* Benefits Section - CloudEmployee Style */}
      <section className="section-lg bg-gradient">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Higgs Boson Consultancy?</h2>
            <p className="lead">
              The future of software development is here. Experience unprecedented efficiency, quality, and cost-effectiveness with our AI-powered approach.
            </p>
          </div>
          
          <div className="feature-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon" dangerouslySetInnerHTML={{ __html: benefit.icon }}>
                </div>
                <h3 className="feature-title">{benefit.title}</h3>
                <p className="feature-text">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section - CloudEmployee Style */}
      <section className="section-lg">
        <div className="container">
          <div className="section-header">
            <h2>We build the team that you'd build yourself</h2>
            <p className="lead">Our revolutionary 3-step process combines AI efficiency with human expertise to deliver exceptional results</p>
          </div>
          
          <div className="feature-grid">
            {processSteps.map((step, index) => (
              <div key={index} className="card card-hover">
                <div className="card-body text-center">
                  <div className="feature-icon mb-4">
                    {step.number}
                  </div>
                  <h3 className="card-title">{step.title}</h3>
                  <p className="card-text">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - CloudEmployee Style */}
      <section className="section-lg bg-gradient">
        <div className="container">
          <div className="section-header">
            <h2>Less recruitment. More releases.</h2>
            <p className="lead">Our AI-powered approach delivers measurable results that transform your development process</p>
          </div>
          
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">70%</div>
              <div className="stat-label">Cost Reduction</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">75%</div>
              <div className="stat-label">Faster Delivery</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100+</div>
              <div className="stat-label">Projects Delivered</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - CloudEmployee Style */}
      <section className="section-lg">
        <div className="container">
          <div className="section-header">
            <h2>What the difference feels like</h2>
            <p className="lead">
              Don't just take our word for it. Hear from industry leaders who have transformed their businesses with our AI-powered solutions.
            </p>
          </div>
          
          <div className="feature-grid">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <div key={index} className="card card-hover">
                <div className="card-body">
                  <div className="mb-4">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                    </svg>
                  </div>
                  <p className="card-text mb-4">"{testimonial.quote}"</p>
                  <div className="d-flex align-items-center">
                    <div>
                      <div className="fw-bold text-dark">{testimonial.author_name}</div>
                      <div className="text-muted">{testimonial.author_title}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ready to Build Section - Inspired by CloudEmployee */}
      <section className={styles.readyToBuildSection}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className={styles.buildContent}>
                <h2 className={styles.buildTitle}>
                  Start building with AI-powered expertise—sourced, embedded, and ready in 7 days.
                </h2>
                <p className={styles.buildDescription}>
                  We combine cutting-edge AI technology with elite development talent to deliver exceptional results. 
                  Backed by proven methodologies and modern infrastructure, our teams are embedded fast and built to scale with your vision.
                </p>
                <button 
                  onClick={() => setShowScheduler(true)}
                  className={styles.buildCta}
                >
                  Start Your Project Now
                </button>
              </div>
            </div>
            <div className="col-lg-4">
              <div className={styles.buildImage}>
                {/* Placeholder for image - you can add an actual image here */}
                <div className={styles.imagePlaceholder}>
                  <div className={styles.placeholderIcon}>
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 12l2 2 4-4"/>
                      <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.28 0 2.49.27 3.59.75"/>
                      <path d="M16 8l-1 1"/>
                      <path d="M19 5l-1 1"/>
                    </svg>
                  </div>
                  <p>AI-Powered Development</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - CloudEmployee Style */}
      <section className="section-lg bg-dark">
        <div className="container">
          <div className="text-center">
            <h2 className="mb-4">Ready to transform your development process?</h2>
            <p className="lead mb-5">
              Join forward-thinking companies that have already revolutionized their software development with our AI-powered approach. Experience faster delivery, lower costs, and superior quality.
            </p>
            <div className="d-flex flex-column align-items-center gap-4">
              <Link to="/contact" className="btn btn-primary btn-lg">
                Start Your Transformation
              </Link>
              <p className={styles.disclaimer}>
                Low upfront fees • No long-term contracts • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule a Call Dialog */}
      {showScheduler && (
        <GoogleCalendarScheduler 
          isOpen={showScheduler}
          onClose={() => setShowScheduler(false)}
        />
      )}
    </div>
  );
};

export default Home;
