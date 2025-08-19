import { useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';
import styles from './Services.module.scss';

const Services = () => {
  const services = useAppSelector((state) => state.services.services);
  const loading = useAppSelector((state) => state.services.loading);

  useEffect(() => {
    console.log('Services page mounted');
  }, []);

  if (loading) {
    return (
      <div className={styles.services}>
        <div className={styles.container}>
          <p>Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.services}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <h1>Our Services</h1>
          <p>Revolutionizing software development with AI-powered solutions that deliver exceptional results faster and more cost-effectively than traditional methods.</p>
        </section>

        <section className={styles.servicesGrid}>
          {services.map((service, index) => (
            <div key={service.id} className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <span>{service.icon}</span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ul className={styles.featureList}>
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className={styles.cta}>
          <div className={styles.ctaContent}>
            <h2>Ready to Transform Your Development Process?</h2>
            <p>Join hundreds of companies that have revolutionized their software development with our AI-powered solutions.</p>
            <div className={styles.ctaButtons}>
              <a href="/contact" className={styles.primaryButton}>Get Started</a>
              <a href="/about" className={styles.secondaryButton}>Learn More</a>
            </div>
          </div>
        </section>

        <section className={styles.testimonial}>
          <div className={styles.testimonialContent}>
            <blockquote>
              "Higgs Boson Consultancy helped us reduce our development time by 75% while maintaining the highest quality standards. Their AI-powered approach is truly revolutionary."
            </blockquote>
            <cite>
              <strong>Sarah Johnson</strong>
              <span>CTO, TechCorp Inc.</span>
            </cite>
          </div>
        </section>

        <section className={styles.process}>
          <h2>Our Development Process</h2>
          <div className={styles.processSteps}>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>1</div>
              <h3>Discovery & Planning</h3>
              <p>We analyze your requirements and create a detailed project roadmap using our AI-assisted planning tools.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>2</div>
              <h3>AI-Powered Development</h3>
              <p>Our AI systems generate code while our experts ensure quality, architecture, and best practices.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>3</div>
              <h3>Testing & Optimization</h3>
              <p>Comprehensive testing and performance optimization ensure your solution is production-ready.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>4</div>
              <h3>Deployment & Support</h3>
              <p>Seamless deployment with ongoing support and maintenance to keep your solution running smoothly.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Services;
