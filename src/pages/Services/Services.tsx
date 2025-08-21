import { useEffect, useState } from 'react';
import { useServices } from '../../hooks/services/useServices';
import type { Service } from '../../store/features/services/servicesSlice';
import styles from './Services.module.scss';

// Fallback dummy data
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
  console.log('✅ Services component loaded');
  const { services, loading, error, actions } = useServices();
  const [usingFallback, setUsingFallback] = useState(false);
  const [displayServices, setDisplayServices] = useState<Service[]>([]);

  useEffect(() => {
    // Only fetch if we don't have data yet
    if (services.length === 0 && !loading && !error) {
      actions.fetch();
    }
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    // Set a timeout to use fallback data if loading takes too long
    if (loading) {
      const timeout = setTimeout(() => {
        if (loading && services.length === 0) {
          setUsingFallback(true);
          setDisplayServices(fallbackServices);
        }
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [loading, services.length]);

  useEffect(() => {
    if (services.length > 0) {
      setDisplayServices(services);
      setUsingFallback(false);
    } else if (error && !loading) {
      setUsingFallback(true);
      setDisplayServices(fallbackServices);
    }
  }, [services, error, loading]);

  if (loading && !usingFallback) {
    return (
      <div className={styles.services}>
        <div className={styles.container}>
          <div style={{ padding: '4rem 0', textAlign: 'center' }}>
            <p>Loading services...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.services}>
      {usingFallback && (
        <div className={styles.notification}>
          <p>⚠️ Unable to connect to server. Showing sample data.</p>
        </div>
      )}
      
      {/* Header Section */}
      <section className={styles.headerSection}>
        <div className={styles.container}>
          <h1 className={styles.headerTitle}>Our Services</h1>
          <p className={styles.headerSubtitle}>
            Revolutionizing software development with AI-powered solutions that deliver exceptional results faster and more cost-effectively than traditional methods.
          </p>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className={styles.servicesGridSection}>
        <div className={styles.container}>
          <div className={styles.servicesGrid}>
            {displayServices.map((service) => (
              <div key={service.id} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>
                  <span>{service.icon}</span>
                </div>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDescription}>{service.description}</p>
                {service.features && (
                  <ul className={styles.serviceFeatures}>
                    {Array.isArray(service.features) 
                      ? service.features.map((feature: string, featureIndex: number) => (
                          <li key={featureIndex} className={styles.featureItem}>
                            <span className={styles.checkmark}>✓</span>
                            {feature}
                          </li>
                        ))
                      : (service.features as string).split(',').map((feature: string, featureIndex: number) => (
                          <li key={featureIndex} className={styles.featureItem}>
                            <span className={styles.checkmark}>✓</span>
                            {feature.trim()}
                          </li>
                        ))
                    }
                  </ul>
                )}
                {service.price_range && (
                  <div className={styles.priceRange}>
                    <strong>Price Range:</strong> {service.price_range}
                  </div>
                )}
                {service.duration && (
                  <div className={styles.duration}>
                    <strong>Duration:</strong> {service.duration}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className={styles.processSection}>
        <div className={styles.container}>
          <div className={styles.processHeader}>
            <h2 className={styles.processTitle}>Our Development Process</h2>
            <p className={styles.processSubtitle}>
              A proven methodology that combines AI efficiency with human expertise
            </p>
          </div>
          <div className={styles.processGrid}>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>1</div>
              <h3 className={styles.stepTitle}>Discovery & Planning</h3>
              <p className={styles.stepDescription}>
                We analyze your requirements and create a detailed project roadmap using our AI-assisted planning tools.
              </p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>2</div>
              <h3 className={styles.stepTitle}>AI-Powered Development</h3>
              <p className={styles.stepDescription}>
                Our AI systems generate code while our experts ensure quality, architecture, and best practices.
              </p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>3</div>
              <h3 className={styles.stepTitle}>Testing & Optimization</h3>
              <p className={styles.stepDescription}>
                Comprehensive testing and performance optimization ensure your solution is production-ready.
              </p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>4</div>
              <h3 className={styles.stepTitle}>Deployment & Support</h3>
              <p className={styles.stepDescription}>
                Seamless deployment with ongoing support and maintenance to keep your solution running smoothly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
