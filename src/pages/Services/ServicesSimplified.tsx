import { useEffect, useState } from 'react';
import styles from './Services.module.scss';

const ServicesSimplified = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      console.log('🚀 Direct API call starting...');
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/services/');
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📊 API Response:', data);
        
        if (data.status === 'success' && data.data) {
          setServices(data.data);
          console.log('✅ Services loaded:', data.data.length);
        } else {
          throw new Error(data.message || 'Failed to fetch services');
        }
      } catch (err) {
        console.error('❌ API Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className={styles.services}>
        <div className={styles.container}>
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h2>Loading services...</h2>
            <p>Making direct API call to Django backend...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.services}>
        <div className={styles.container}>
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h2>Error loading services</h2>
            <p style={{ color: 'red' }}>Error: {error}</p>
            <p>Check the browser console for more details.</p>
          </div>
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
          <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            Loaded {services.length} services from database
          </p>
        </section>

        <section className={styles.servicesGrid}>
          {services.map((service, index) => (
            <div key={service.id || index} className={styles.serviceCard}>
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
                      {service.features.map((feature: string, idx: number) => (
                        <li key={idx}>{feature}</li>
                      ))}
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

export default ServicesSimplified;
