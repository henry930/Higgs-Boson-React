import { useEffect } from 'react';
import styles from './Services.module.scss';

const Services = () => {
  useEffect(() => {
    console.log('Services page mounted');
  }, []);

  const services = [
    {
      icon: '🤖',
      title: 'AI-Powered Development',
      description: 'Leverage artificial intelligence to accelerate your software development process with intelligent code generation, automated testing, and smart optimization.',
      features: ['Code Generation', 'Automated Testing', 'Performance Optimization', 'Bug Detection']
    },
    {
      icon: '💰',
      title: 'Cost-Effective Solutions',
      description: 'Reduce development costs by up to 70% while maintaining high-quality standards through our streamlined AI-assisted development process.',
      features: ['70% Cost Reduction', 'Faster Time-to-Market', 'Reduced Team Size', 'Lower Maintenance']
    },
    {
      icon: '🚀',
      title: 'Rapid Deployment',
      description: 'Deploy large-scale software solutions in weeks, not months, with our accelerated development methodology and expert project management.',
      features: ['75% Faster Delivery', 'Agile Methodology', 'Continuous Integration', 'DevOps Integration']
    },
    {
      icon: '👥',
      title: 'Expert Consultation',
      description: 'Work with our lean teams of experts who focus on strategy, management, and quality oversight while AI handles the heavy lifting.',
      features: ['Strategic Planning', 'Technical Leadership', 'Quality Assurance', 'Project Management']
    },
    {
      icon: '⭐',
      title: 'Enterprise Quality',
      description: 'Ensure enterprise-grade quality and reliability with our combination of AI-assisted development and human expertise oversight.',
      features: ['Quality Assurance', 'Security Compliance', 'Scalability', 'Documentation']
    },
    {
      icon: '🔧',
      title: 'Maintenance & Support',
      description: 'Ongoing maintenance, updates, and feature enhancements to keep your software running smoothly and up-to-date.',
      features: ['24/7 Support', 'Regular Updates', 'Performance Monitoring', 'Feature Enhancement']
    }
  ];

  return (
    <div className={styles.services}>
      {/* Header Section */}
      <section className={styles.headerSection}>
        <div className="container">
          <h1 className={styles.headerTitle}>
            Our Services
          </h1>
          <p className={styles.headerSubtitle}>
            Comprehensive AI-powered development solutions designed to transform your business and accelerate your digital transformation.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className={styles.servicesGridSection}>
        <div className="container">
          <div className={styles.servicesGrid}>
            {services.map((service, index) => (
              <div key={index} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>
                  {service.icon}
                </div>
                <h3 className={styles.serviceTitle}>
                  {service.title}
                </h3>
                <p className={styles.serviceDescription}>
                  {service.description}
                </p>
                <ul className={styles.serviceFeatures}>
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className={styles.featureItem}>
                      <span className={styles.checkmark}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className={styles.processSection}>
        <div className="container">
          <div className={styles.processHeader}>
            <h2 className={styles.processTitle}>
              Our Development Process
            </h2>
            <p className={styles.processSubtitle}>
              A streamlined approach that combines AI efficiency with human expertise
            </p>
          </div>

          <div className={styles.processGrid}>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>
                1
              </div>
              <h3 className={styles.stepTitle}>Discovery & Strategy</h3>
              <p className={styles.stepDescription}>
                We analyze your requirements and create a comprehensive development strategy using AI-assisted project planning.
              </p>
            </div>

            <div className={styles.processStep}>
              <div className={styles.stepNumber}>
                2
              </div>
              <h3 className={styles.stepTitle}>AI-Accelerated Development</h3>
              <p className={styles.stepDescription}>
                Our expert teams leverage cutting-edge AI tools to accelerate coding, testing, and deployment.
              </p>
            </div>

            <div className={styles.processStep}>
              <div className={styles.stepNumber}>
                3
              </div>
              <h3 className={styles.stepTitle}>Delivery & Evolution</h3>
              <p className={styles.stepDescription}>
                Expert project managers ensure seamless delivery and provide ongoing maintenance and updates.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
