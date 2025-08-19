import { Link } from 'react-router-dom';
import BenefitCard from '../../components/BenefitCard/BenefitCard';
import Carousel from '../../components/Carousel/Carousel';
import styles from './Home.module.scss';

const Home = () => {
  const benefits = [
    {
      icon: '💰',
      title: '70% Cost Reduction',
      description: 'Dramatically reduce development costs while maintaining enterprise-quality standards and faster delivery times.'
    },
    {
      icon: '⚡',
      title: '75% Faster Delivery',
      description: 'Deploy large-scale applications in weeks, not months, with our AI-accelerated development process.'
    },
    {
      icon: '👥',
      title: 'Lean Expert Teams',
      description: 'Achieve superior results with smaller teams focused on strategy, management, and quality oversight.'
    },
    {
      icon: '⭐',
      title: 'Enterprise Quality',
      description: 'AI-assisted development with human expertise ensures exceptional quality and reliability.'
    }
  ];

  const processSteps = [
    {
      number: '1',
      title: 'Discovery & Strategy',
      description: 'We analyze your requirements and create a comprehensive development strategy using AI-assisted project planning and risk assessment.'
    },
    {
      number: '2',
      title: 'AI-Accelerated Development',
      description: 'Our expert teams leverage cutting-edge AI tools to accelerate coding, testing, and deployment while ensuring quality standards.'
    },
    {
      number: '3',
      title: 'Delivery & Evolution',
      description: 'Expert project managers ensure seamless delivery and provide ongoing maintenance, updates, and feature enhancements.'
    }
  ];

  const testimonials = [
    {
      id: '1',
      content: (
        <div className={styles.testimonial}>
          <div className={styles.testimonialContent}>
            <p>"Higgs Boson Consultancy transformed our development process completely. We delivered our major product launch 3 months ahead of schedule with 60% cost savings."</p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.authorInfo}>
                <h4>Sarah Johnson</h4>
                <span>CTO, TechFlow Solutions</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: '2',
      content: (
        <div className={styles.testimonial}>
          <div className={styles.testimonialContent}>
            <p>"The AI-powered development approach is revolutionary. Our team productivity increased by 75% while maintaining the highest quality standards."</p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.authorInfo}>
                <h4>Michael Chen</h4>
                <span>VP Engineering, DataVision Corp</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: '3',
      content: (
        <div className={styles.testimonial}>
          <div className={styles.testimonialContent}>
            <p>"Working with Higgs Boson was a game-changer. They delivered enterprise-grade solutions that would have taken our team 12 months in just 3 months."</p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.authorInfo}>
                <h4>Emily Rodriguez</h4>
                <span>Product Director, InnovateLab</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className={styles.home}>
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>
                Revolutionizing Software Development with AI
              </h1>
              <p className={styles.heroSubtitle}>
                Transform your business with our innovative AI-powered software development approach. 
                Reduce costs by up to 70%, accelerate delivery, and maintain excellence with fewer resources.
              </p>
              <div className={styles.heroButtons}>
                <Link to="/services" className={styles.primaryButton}>
                  🚀 Explore Our Services
                </Link>
                <Link to="/contact" className={styles.secondaryButton}>
                  → Get Started Today
                </Link>
              </div>
            </div>
            <div className={styles.heroVisual}>
              <div className={styles.brainIcon}>🧠</div>
            </div>
          </div>
        </div>
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
              items={testimonials}
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
