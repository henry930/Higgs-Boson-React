import { Link } from 'react-router-dom';
import { useHomeDataRedux } from '../../hooks/useHomeDataRedux';
import styles from './Home.module.scss';

const Home = () => {
  const { data, loading, error, apiConnected } = useHomeDataRedux();
  const { benefits, processSteps, testimonials } = data;
  
  // Show notification for offline mode
  const isUsingFallback = !apiConnected;

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
      {isUsingFallback && (
        <div className={styles.fallbackNotice}>
          <p>⚠️ Using offline content - some features may be limited</p>
        </div>
      )}

      {/* Hero Section - CloudEmployee Style */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              AI-powered development that feels <span className={styles.heroAccent}>in-house</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Do you believe this website is 100% AI code generation? By professional developer guidance, AI can follow your rituals, and fit your culture, do you want to know more?
            </p>
            <div className={styles.heroButtons}>
              <Link to="/contact" className={styles.primaryButton}>
                Start Your Project
                <svg className={styles.buttonIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </Link>
              <Link to="/services" className={styles.secondaryButton}>
                Learn More
              </Link>
            </div>
            <div className={styles.heroStats}>
              <p className={styles.heroStatsText}>
                <strong>Trusted by 100+ innovative companies</strong> • <span className={styles.statHighlight}>70% cost reduction</span> • <span className={styles.statHighlight}>75% faster delivery</span>
              </p>
            </div>
          </div>
        </div>
      </section>

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
                <Link to="/contact" className={styles.buildCta}>
                  Start Your Project Now
                </Link>
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
              <p className="text-muted mb-0">
                No upfront fees • No long-term contracts • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
