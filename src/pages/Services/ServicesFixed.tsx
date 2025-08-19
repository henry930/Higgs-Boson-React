import { useEffect, useState } from 'react';
import { useServices } from '../../hooks/services/useServices';
import type { Service } from '../../store/features/services/servicesSlice';
import styles from './Services.module.scss';

// Fallback data in case API fails
const fallbackServices: Service[] = [
  {
    id: 1,
    title: "AI-Powered Web Development",
    description: "Transform your web presence with cutting-edge AI-assisted development. Our expert teams leverage advanced AI tools to build scalable, high-performance web applications that deliver exceptional user experiences while reducing development time by 75%.",
    short_description: "AI-accelerated web development with 75% faster delivery",
    icon: "🚀",
    features: ["React/Vue/Angular", "Node.js/Python/PHP", "Cloud-native architecture", "AI-assisted coding", "Automated testing", "Performance optimization"],
    price_range: "$10,000 - $100,000",
    duration: "2-12 weeks",
    category: "Web Development",
    order: 1,
    featured: true,
    active: true,
    created_at: "",
    updated_at: ""
  },
  {
    id: 2,
    title: "Enterprise AI Solutions",
    description: "Deploy enterprise-grade AI solutions that transform business operations. From machine learning models to intelligent automation, we deliver scalable AI systems that provide competitive advantages and measurable ROI.",
    short_description: "Enterprise AI systems with proven ROI",
    icon: "🤖",
    features: ["Machine Learning", "Natural Language Processing", "Computer Vision", "Predictive Analytics", "Process Automation", "Data Pipeline Integration"],
    price_range: "$25,000 - $500,000",
    duration: "4-24 weeks",
    category: "AI & Machine Learning",
    order: 2,
    featured: true,
    active: true,
    created_at: "",
    updated_at: ""
  },
  {
    id: 3,
    title: "Mobile App Development",
    description: "Create powerful mobile applications with our AI-accelerated development process. We build native iOS and Android apps as well as cross-platform solutions using React Native and Flutter.",
    short_description: "AI-powered mobile app development for iOS and Android",
    icon: "📱",
    features: ["Native iOS/Android", "React Native", "Flutter", "Progressive Web Apps", "App Store Optimization"],
    price_range: "$15,000 - $150,000",
    duration: "3-16 weeks",
    category: "Mobile Development",
    order: 3,
    featured: true,
    active: true,
    created_at: "",
    updated_at: ""
  },
  {
    id: 4,
    title: "Cloud Infrastructure & DevOps",
    description: "Scale your applications with our cloud-native infrastructure solutions. We provide comprehensive DevOps services including CI/CD pipelines, monitoring, and automated deployment strategies.",
    short_description: "Scalable cloud infrastructure and DevOps automation",
    icon: "☁️",
    features: ["AWS/Azure/GCP", "Docker/Kubernetes", "CI/CD Pipelines", "Infrastructure as Code", "Monitoring & Analytics", "Security Implementation"],
    price_range: "$5,000 - $75,000",
    duration: "1-8 weeks",
    category: "Infrastructure",
    order: 4,
    featured: false,
    active: true,
    created_at: "",
    updated_at: ""
  }
];

const Services = () => {
  const { services, loading, actions, error } = useServices();
  const [displayServices, setDisplayServices] = useState<Service[]>(fallbackServices);
  const [usingFallback, setUsingFallback] = useState(true);

  console.log('🔍 Services component state:', { 
    services: services?.length || 0, 
    loading, 
    error,
    hasServices: !!services 
  });

  useEffect(() => {
    console.log('🚀 Fetching services from API...');
    actions.fetch();
  }, [actions]);

  useEffect(() => {
    console.log('📊 Services data changed:', { 
      servicesLength: services?.length,
      hasError: !!error 
    });
    
    if (services && services.length > 0) {
      console.log('✅ Loaded services from API:', services.length);
      setDisplayServices(services);
      setUsingFallback(false);
    } else if (error) {
      console.log('⚠️ API error, using fallback data:', error);
      setDisplayServices(fallbackServices);
      setUsingFallback(true);
    } else if (!loading && (!services || services.length === 0)) {
      console.log('📋 No services found, using fallback data');
      setDisplayServices(fallbackServices);
      setUsingFallback(true);
    }
  }, [services, error, loading]);

  // Timeout for loading state - don't stay loading forever
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log('⏰ Loading timeout - using fallback data');
        setDisplayServices(fallbackServices);
        setUsingFallback(true);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeoutId);
  }, [loading]);

  if (loading && displayServices.length === 0) {
    return (
      <div className={styles.services}>
        <div className={styles.container}>
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h2>Loading services...</h2>
            <p>Fetching our latest services from the database...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.services}>
      {usingFallback && (
        <div className={styles.notification}>
          <p>⚠️ Using sample data - API connection unavailable</p>
        </div>
      )}
      
      <div className={styles.container}>
        <section className={styles.hero}>
          <h1>Our Services</h1>
          <p>Revolutionizing software development with AI-powered solutions that deliver exceptional results faster and more cost-effectively than traditional methods.</p>
          <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            {usingFallback ? 
              `Showing ${displayServices.length} sample services` : 
              `Loaded ${displayServices.length} services from database`
            }
          </p>
        </section>

        <section className={styles.servicesGrid}>
          {displayServices.map((service) => (
            <div key={service.id} className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                {service.icon}
              </div>
              
              <div className={styles.serviceContent}>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceShortDescription}>{service.short_description}</p>
                <p className={styles.serviceDescription}>{service.description}</p>
                
                <div className={styles.serviceDetails}>
                  <div className={styles.serviceMeta}>
                    <span className={styles.category}>{service.category}</span>
                    <span className={styles.duration}>{service.duration}</span>
                    <span className={styles.priceRange}>{service.price_range}</span>
                  </div>
                </div>

                {service.features && service.features.length > 0 && (
                  <div className={styles.featuresSection}>
                    <h4>Key Features:</h4>
                    <ul className={styles.featureList}>
                      {Array.isArray(service.features) 
                        ? service.features.map((feature: string, featureIndex: number) => (
                            <li key={featureIndex}>{feature}</li>
                          ))
                        : (service.features as string).split(',').map((feature: string, featureIndex: number) => (
                            <li key={featureIndex}>{feature.trim()}</li>
                          ))
                      }
                    </ul>
                  </div>
                )}

                <div className={styles.serviceActions}>
                  <button 
                    className={styles.primaryButton}
                    onClick={() => window.location.href = '/contact'}
                  >
                    Get Started
                  </button>
                  <button 
                    className={styles.secondaryButton}
                    onClick={() => window.location.href = '/contact'}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className={styles.ctaSection}>
          <h2>Ready to Transform Your Business?</h2>
          <p>Let's discuss how our AI-powered solutions can deliver exceptional results for your project.</p>
          <button 
            className={styles.ctaButton}
            onClick={() => window.location.href = '/contact'}
          >
            Start Your Project Today
          </button>
        </section>
      </div>
    </div>
  );
};

export default Services;
