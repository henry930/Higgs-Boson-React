import styles from './About.module.scss';

const About = () => {
  const values = [
    {
      icon: '🎯',
      title: 'Innovation First',
      description: 'We leverage cutting-edge AI technology to solve complex business challenges with creative solutions.'
    },
    {
      icon: '🤝',
      title: 'Client Partnership',
      description: 'We work as an extension of your team, ensuring your success is our primary objective.'
    },
    {
      icon: '⚡',
      title: 'Rapid Delivery',
      description: 'Our AI-accelerated development process delivers enterprise-grade solutions in record time.'
    },
    {
      icon: '🏆',
      title: 'Excellence',
      description: 'We maintain the highest standards of quality in every project we undertake.'
    },
    {
      icon: '💰',
      title: 'Lower Cost',
      description: 'AI-Powered development can drastically cost cutting, almost 50% you can save comparing with developers recruitment.'
    },
    {
      icon: '👂',
      title: 'Listen',
      description: 'Not only AI, we deploy account manager for each project, they can focusly listen on your need and provide professional consultation.'
    }
  ];

  const milestones = [
    {
      year: '2019',
      title: 'Company Founded',
      description: 'Started with a vision to democratize AI development for businesses of all sizes.'
    },
    {
      year: '2020',
      title: 'First Enterprise Client',
      description: 'Delivered our first major AI transformation project for a Fortune 500 company.'
    },
    {
      year: '2021',
      title: 'Team Expansion',
      description: 'Grew to 25+ AI specialists and opened offices in Hong Kong and London.'
    },
    {
      year: '2022',
      title: 'Industry Recognition',
      description: 'Named "AI Consultancy of the Year" by TechCrunch and featured in Forbes.'
    },
    {
      year: '2023',
      title: 'Global Reach',
      description: 'Expanded to serve clients across 15 countries with 100+ successful projects.'
    }
  ];

  return (
    <div className={styles.about}>
      <div className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Pioneering the Future of <span className={styles.accent}>AI Development</span></h1>
            <p className={styles.heroDescription}>
              Founded by AI researchers and industry veterans, Higgs Boson Consultancy is dedicated to transforming businesses through using AI and cutting-edge technology to optimize in software development.
            </p>
          </div>
        </div>
      </div>

      <div className={`${styles.aboutSection} ${styles.missionSection}`}>
        <div className={styles.container}>
          <div className={styles.missionGrid}>
            <div className={styles.missionContent}>
              <h2>Our Mission</h2>
              <p>
                To democratize artificial intelligence and make enterprise-grade digital solutions accessible to businesses of all sizes. We believe that every company, regardless of size or industry, should have access to the transformative power of AI.
              </p>
              <p>
                Through our unique combination of human expertise and AI-accelerated development, we deliver solutions that are not only technically superior but also cost-effective and delivered in record time.
              </p>
            </div>
            <div className={styles.missionStats}>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>100+</div>
                <div className={styles.statLabel}>Projects Delivered</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>75%</div>
                <div className={styles.statLabel}>Faster Delivery</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>50+</div>
                <div className={styles.statLabel}>Enterprise Clients</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>99.9%</div>
                <div className={styles.statLabel}>Uptime Guarantee</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.aboutSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Our Values</h2>
          </div>
          <div className={styles.valuesGrid}>
            {values.map((value, index) => (
              <div key={index} className={styles.valueCard}>
                <div className={styles.valueIcon}>{value.icon}</div>
                <h3 className={styles.valueTitle}>{value.title}</h3>
                <p className={styles.valueDescription}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.aboutSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Our Journey</h2>
          </div>
          <div className={styles.timeline}>
            {milestones.map((milestone, index) => (
              <div key={index} className={styles.timelineItem}>
                <div className={styles.timelineYear}>{milestone.year}</div>
                <div className={styles.timelineContent}>
                  <h3>{milestone.title}</h3>
                  <p>{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Transform Your Business?</h2>
            <p className={styles.ctaDescription}>
              Join the hundreds of companies that have already revolutionized their operations
              with our AI-powered solutions.
            </p>
            <div className={styles.ctaButtons}>
              <a href="/contact" className={styles.primaryButton}>Start Your Project</a>
              <a href="/services" className={styles.secondaryButton}>View Our Services</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
