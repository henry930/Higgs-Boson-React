import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import styles from './HowItWorks.module.scss';

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      stepRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + rect.height;

          if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
            setActiveStep(index);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={styles.howItWorks}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Your Path to <span className={styles.heroAccent}>Top Technical Talent</span>
            </h1>
            <p className={styles.heroSubtitle}>
              We've simplified the process of finding, hiring, and retaining top technical talent with AI-powered development - all at a fraction of the cost of traditional hiring.
            </p>
            <div className={styles.heroButtons}>
              <Link to="/contact" className={styles.primaryButton}>
                Start Hiring
              </Link>
              <Link to="/about" className={styles.secondaryButton}>
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Your Hiring Headaches Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Your Hiring Headaches? Gone.</h2>
            <p className={styles.sectionSubtitle}>
              With Higgs Boson Consultancy, you're not just hiring temporary help. You're building a dedicated, AI-powered team that's committed to your long-term success.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Steps Process Section - CloudEmployee Style */}
      <section className={styles.processSection}>
        <div className={styles.processContainer}>
          {/* Left Column - Sticky Header */}
          <div className={styles.processHeader}>
            <h2>4 Steps to AI-Powered Development</h2>
            <p className={styles.sectionSubtitle}>
              Our AI-driven process is the game-changer. Where traditional agencies focus on basic skill matching, we go far beyond that, into AI optimization, solution-focused automation, business intelligence, and more.
            </p>
            <div className={styles.ctaButtons}>
              <Link to="/contact" className={styles.primaryButton}>Book A Call</Link>
              <Link to="/services" className={styles.secondaryButton}>Learn More</Link>
            </div>
          </div>

          {/* Right Column - Steps with Progress Bar */}
          <div className={styles.processStepsContainer}>
            <div className={styles.processSteps}>
              <div 
                ref={(el) => { stepRefs.current[0] = el; }}
                className={`${styles.processStep} ${activeStep === 0 ? styles.active : ''}`}
              >
                <div className={styles.stepContent}>
                  <div className={styles.stepTextContent}>
                    <div className={styles.stepHeader}>
                      <div className={styles.stepNumber}>01</div>
                    </div>
                    <h3 className={styles.stepTitle}>Estimate your project</h3>
                    <p className={styles.stepDescription}>
                      Please input your project description and requirements, including budgets, timeline and tech stacks from our AI estimation system. A basic estimated price and number of days works will be prompted and informed our specialists.
                    </p>
                  </div>
                  <div className={styles.stepImageContainer}>
                    <div className={`${styles.stepImage} ${styles.step1}`}></div>
                  </div>
                </div>
              </div>

              <div 
                ref={(el) => { stepRefs.current[1] = el; }}
                className={`${styles.processStep} ${activeStep === 1 ? styles.active : ''}`}
              >
                <div className={styles.stepContent}>
                  <div className={styles.stepTextContent}>
                    <div className={styles.stepHeader}>
                      <div className={styles.stepNumber}>02</div>
                    </div>
                    <h3 className={styles.stepTitle}>Our specialist contact you</h3>
                    <p className={styles.stepDescription}>
                      A rather deep project evaluation, term and condition, and all work processes that our specialist will explain to you. If everything is fine, contract will be issued to you. You may kickstart.
                    </p>
                  </div>
                  <div className={styles.stepImageContainer}>
                    <div className={`${styles.stepImage} ${styles.step2}`}></div>
                  </div>
                </div>
              </div>

              <div 
                ref={(el) => { stepRefs.current[2] = el; }}
                className={`${styles.processStep} ${activeStep === 2 ? styles.active : ''}`}
              >
                <div className={styles.stepContent}>
                  <div className={styles.stepTextContent}>
                    <div className={styles.stepHeader}>
                      <div className={styles.stepNumber}>03</div>
                    </div>
                    <h3 className={styles.stepTitle}>As if an employee hired</h3>
                    <p className={styles.stepDescription}>
                      For every project, we will assign a professional developer to follow your case. You can contact them with Slack, zoom meeting (weekly), and send any feedbacks, comments and guidelines to him.
                    </p>
                  </div>
                  <div className={styles.stepImageContainer}>
                    <div className={`${styles.stepImage} ${styles.step3}`}></div>
                  </div>
                </div>
              </div>

              <div 
                ref={(el) => { stepRefs.current[3] = el; }}
                className={`${styles.processStep} ${activeStep === 3 ? styles.active : ''}`}
              >
                <div className={styles.stepContent}>
                  <div className={styles.stepTextContent}>
                    <div className={styles.stepHeader}>
                      <div className={styles.stepNumber}>04</div>
                    </div>
                    <h3 className={styles.stepTitle}>Weekly Evaluation and Bill Settle</h3>
                    <p className={styles.stepDescription}>
                      Every week, your developer will present and give you a report about the progress of your project. You can check all scheduled development. if pass, settle weekly bill (i.e. 5 days / 40 hours). If fail, we will fixed all agreed functionalities, otherwise, we will return money of those failure parts, and you can always stop our service.
                    </p>
                  </div>
                  <div className={styles.stepImageContainer}>
                    <div className={`${styles.stepImage} ${styles.step4}`}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beyond Skillset Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Beyond a Skillset: AI Innovation, Efficiency, and Intelligence</h2>
            <p className={styles.sectionSubtitle}>
              Our AI-powered approach doesn't just match skills - we create intelligent solutions that adapt, learn, and evolve with your business needs.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🤖</div>
              <h3>AI-First Development</h3>
              <p>Build solutions powered by cutting-edge AI that learns from your data and optimizes performance automatically.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⚡</div>
              <h3>Lightning Fast Delivery</h3>
              <p>AI-accelerated development means 75% faster delivery times while maintaining the highest quality standards.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎯</div>
              <h3>Intelligent Automation</h3>
              <p>Smart systems that handle routine tasks automatically, freeing your team to focus on strategic initiatives.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🧠</div>
              <h3>Adaptive Intelligence</h3>
              <p>Solutions that grow and adapt with your business, making intelligent decisions based on real-time data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Beyond Technical Ability Section */}
      <section className={styles.benefitsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Beyond Technical Ability</h2>
            <p className={styles.sectionSubtitle}>
              You might have concerns about AI integration and that's why, in addition to technical excellence and rigorous testing, we also ensure:
            </p>
            <div className={styles.ctaButtons}>
              <Link to="/contact" className={styles.primaryButton}>View Pricing</Link>
            </div>
          </div>

          <div className={styles.benefitsGrid}>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>🌐</div>
              <h3>Seamless Integration</h3>
              <p>Our AI solutions integrate perfectly with your existing systems, workflows, and team processes without disruption.</p>
            </div>

            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>🔒</div>
              <h3>Enterprise Security</h3>
              <p>Bank-level security protocols protect your data while AI optimization ensures peak performance and reliability.</p>
            </div>

            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>⏰</div>
              <h3>24/7 AI Monitoring</h3>
              <p>Continuous AI monitoring and optimization means your systems work flawlessly around the clock, in any time zone.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>What the difference feels like:</h2>
          </div>

          <div className={styles.testimonialsGrid}>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialContent}>
                <p>"The AI-powered development from Higgs Boson completely transformed our business. What used to take months now happens in weeks, and the quality is exceptional."</p>
              </div>
              <div className={styles.testimonialAuthor}>
                <strong>Sarah Johnson</strong>
                <span>CTO, TechStart Inc</span>
              </div>
            </div>

            <div className={styles.testimonialCard}>
              <div className={styles.testimonialContent}>
                <p>"We've seen a 70% reduction in development costs and 75% faster delivery. The AI solutions are incredibly intelligent and adapt to our changing needs."</p>
              </div>
              <div className={styles.testimonialAuthor}>
                <strong>Mike Chen</strong>
                <span>Founder, InnovateLab</span>
              </div>
            </div>

            <div className={styles.testimonialCard}>
              <div className={styles.testimonialContent}>
                <p>"The team's expertise in AI development is unmatched. They delivered solutions that not only met our requirements but exceeded our expectations."</p>
              </div>
              <div className={styles.testimonialAuthor}>
                <strong>Emma Rodriguez</strong>
                <span>Product Manager, FutureTech</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* De-Risking Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>De-Risking AI Development</h2>
            <p className={styles.sectionSubtitle}>
              AI development can feel complex, so we offer the following as standard:
            </p>
          </div>

          <div className={styles.riskGrid}>
            <div className={styles.riskItem}>
              <h3>💼 Full Project Insurance</h3>
              <p>Comprehensive coverage and guarantee for all deliverables</p>
            </div>
            <div className={styles.riskItem}>
              <h3>📝 Transparent Contracts</h3>
              <p>Clear, simple agreements with fixed pricing in your currency</p>
            </div>
            <div className={styles.riskItem}>
              <h3>🔄 Agile Flexibility</h3>
              <p>Adapt and modify requirements as your business needs evolve</p>
            </div>
            <div className={styles.riskItem}>
              <h3>✅ Quality Guarantee</h3>
              <p>Two week money-back guarantee if deliverables don't meet standards</p>
            </div>
          </div>

          <div className={styles.ctaButtons}>
            <Link to="/contact" className={styles.primaryButton}>Start Hiring</Link>
            <Link to="/about" className={styles.secondaryButton}>Learn More About Us</Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Let's Build Your Perfect AI Solution Together</h2>
            <div className={styles.ctaButtons}>
              <Link to="/contact" className={styles.primaryButton}>Book A Call</Link>
              <Link to="/contact" className={styles.secondaryButton}>Start Hiring</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
