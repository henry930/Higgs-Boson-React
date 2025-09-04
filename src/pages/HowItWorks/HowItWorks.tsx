import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import SEO from '../../components/SEO/SEO';
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
      <SEO 
        title="How It Works"
        description="Discover our proven AI-powered development process. Learn how we deliver high-quality software solutions 75% faster while reducing costs by 70%."
        keywords="AI development process, software development methodology, how it works, development workflow"
        url="https://higgsbosonconsultancy.co.uk/how-it-works"
      />
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
              <Link to="/schedule-a-call" className={styles.primaryButton}>
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
              <Link to="/schedule-a-call" className={styles.primaryButton}>Book A Call</Link>
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
            <h2>How we AI-Powered?</h2>
            <p className={styles.sectionSubtitle}>
              By using our AI, all the development can rely on AI, our developers only need to monitor, guide and test in the whole process. Therefore, they can more focus on listening on customers.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="2" fill="currentColor"/>
                  <circle cx="8" cy="8" r="1" fill="currentColor"/>
                  <circle cx="16" cy="8" r="1" fill="currentColor"/>
                  <circle cx="8" cy="16" r="1" fill="currentColor"/>
                  <circle cx="16" cy="16" r="1" fill="currentColor"/>
                </svg>
              </div>
              <h3>AI-Powered Development</h3>
              <p>Most of those coding is by AI, based on developers' guidance and monitoring. It saves almost 50% of development time.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  <circle cx="13" cy="6" r="1" fill="currentColor"/>
                  <circle cx="11" cy="18" r="1" fill="currentColor"/>
                </svg>
              </div>
              <h3>Lightning Fast Delivery</h3>
              <p>AI-powered development means 75% faster deliver times while maintaining the highest quality standards.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 1V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 21V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M4.22 4.22L5.64 5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M18.36 18.36L19.78 19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M1 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M21 12H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M4.22 19.78L5.64 18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="1" fill="currentColor"/>
                </svg>
              </div>
              <h3>Intelligent Automation</h3>
              <p>AI takes up all routine tasks, freeing your team to focus on strategic initialives.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="7" cy="7" r="1" fill="currentColor"/>
                  <circle cx="17" cy="7" r="1" fill="currentColor"/>
                  <circle cx="7" cy="17" r="1" fill="currentColor"/>
                  <circle cx="17" cy="17" r="1" fill="currentColor"/>
                </svg>
              </div>
              <h3>Talents + AI</h3>
              <p>AI give advices on the development based on customer requirements, and professional developers guidance.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.828 14.828L21 21M16.5 10.5A6 6 0 1 1 4.5 10.5A6 6 0 0 1 16.5 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 10.5H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M10.5 7V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="10.5" cy="10.5" r="2" stroke="currentColor" strokeWidth="1"/>
                  <circle cx="8" cy="8" r="0.5" fill="currentColor"/>
                  <circle cx="13" cy="8" r="0.5" fill="currentColor"/>
                  <circle cx="8" cy="13" r="0.5" fill="currentColor"/>
                  <circle cx="13" cy="13" r="0.5" fill="currentColor"/>
                </svg>
              </div>
              <h3>AI Test and Simulation</h3>
              <p>Using AI, more tests on your products is possible. Also, it can pinpoint you any harzards and bugs may occur.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.7 6.3A1 1 0 0 0 13 5H9C7.89543 5 7 5.89543 7 7V19C7 20.1046 7.89543 21 9 21H15C16.1046 21 17 20.1046 17 19V9A1 1 0 0 0 15.7 6.3L14.7 6.3Z" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="9,9 12,12 15,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 12V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="8" r="1" fill="currentColor"/>
                  <circle cx="10" cy="16" r="0.5" fill="currentColor"/>
                  <circle cx="12" cy="16" r="0.5" fill="currentColor"/>
                  <circle cx="14" cy="16" r="0.5" fill="currentColor"/>
                </svg>
              </div>
              <h3>Better Maintenance</h3>
              <p>All AI-Powered products could be maintained by AI solely. Customers no need to hire developers only for maintaining their system.</p>
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
              <Link to="/schedule-a-call" className={styles.primaryButton}>View Pricing</Link>
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
            <Link to="/schedule-a-call" className={styles.primaryButton}>Start Hiring</Link>
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
              <Link to="/schedule-a-call" className={styles.primaryButton}>Book A Call</Link>
              <Link to="/schedule-a-call" className={styles.secondaryButton}>Start Hiring</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
