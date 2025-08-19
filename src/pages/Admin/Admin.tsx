import { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import type { Benefit, ProcessStep, Testimonial, HeroSlide } from '../../types';
import styles from './Admin.module.scss';

const Admin = () => {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'benefits' | 'process' | 'testimonials' | 'hero'>('benefits');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [benefitsRes, processRes, testimonialsRes, heroRes] = await Promise.all([
        dataService.getBenefits(),
        dataService.getProcessSteps(),
        dataService.getTestimonials(),
        dataService.getHeroSlides()
      ]);

      if (benefitsRes.status === 'success') setBenefits(benefitsRes.data);
      if (processRes.status === 'success') setProcessSteps(processRes.data);
      if (testimonialsRes.status === 'success') setTestimonials(testimonialsRes.data);
      if (heroRes.status === 'success') setHeroSlides(heroRes.data);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBenefitActive = async (id: number, active: boolean) => {
    const result = await dataService.updateBenefit(id, { active: !active });
    if (result.status === 'success') {
      loadData();
    }
  };

  if (loading) {
    return (
      <div className={styles.admin}>
        <div className={styles.loading}>Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className={styles.admin}>
      <div className={styles.header}>
        <h1>Content Management Admin</h1>
        <p>Manage your website content directly from the database</p>
      </div>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'benefits' ? styles.active : ''}`}
          onClick={() => setActiveTab('benefits')}
        >
          Benefits ({benefits.length})
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'process' ? styles.active : ''}`}
          onClick={() => setActiveTab('process')}
        >
          Process Steps ({processSteps.length})
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'testimonials' ? styles.active : ''}`}
          onClick={() => setActiveTab('testimonials')}
        >
          Testimonials ({testimonials.length})
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'hero' ? styles.active : ''}`}
          onClick={() => setActiveTab('hero')}
        >
          Hero Slides ({heroSlides.length})
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'benefits' && (
          <div className={styles.section}>
            <h2>Benefits Management</h2>
            <div className={styles.grid}>
              {benefits.map((benefit) => (
                <div key={benefit.id} className={`${styles.card} ${!benefit.active ? styles.inactive : ''}`}>
                  <div className={styles.cardHeader}>
                    <span className={styles.icon}>{benefit.icon}</span>
                    <span className={styles.order}>Order: {benefit.order}</span>
                  </div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                  <div className={styles.cardActions}>
                    <button 
                      className={`${styles.toggleBtn} ${benefit.active ? styles.active : styles.inactive}`}
                      onClick={() => toggleBenefitActive(benefit.id, benefit.active)}
                    >
                      {benefit.active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'process' && (
          <div className={styles.section}>
            <h2>Process Steps Management</h2>
            <div className={styles.grid}>
              {processSteps.map((step) => (
                <div key={step.id} className={`${styles.card} ${!step.active ? styles.inactive : ''}`}>
                  <div className={styles.cardHeader}>
                    <span className={styles.stepNumber}>{step.number}</span>
                    <span className={styles.order}>Order: {step.order}</span>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  <div className={styles.cardActions}>
                    <span className={`${styles.status} ${step.active ? styles.active : styles.inactive}`}>
                      {step.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className={styles.section}>
            <h2>Testimonials Management</h2>
            <div className={styles.grid}>
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className={`${styles.card} ${!testimonial.active ? styles.inactive : ''}`}>
                  <div className={styles.cardHeader}>
                    <span className={styles.order}>Order: {testimonial.order}</span>
                    {testimonial.featured && <span className={styles.featured}>Featured</span>}
                  </div>
                  <blockquote>"{testimonial.quote}"</blockquote>
                  <div className={styles.author}>
                    <strong>{testimonial.authorName}</strong>
                    <span>{testimonial.authorTitle}</span>
                  </div>
                  <div className={styles.cardActions}>
                    <span className={`${styles.status} ${testimonial.active ? styles.active : styles.inactive}`}>
                      {testimonial.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'hero' && (
          <div className={styles.section}>
            <h2>Hero Slides Management</h2>
            <div className={styles.grid}>
              {heroSlides.map((slide) => (
                <div key={slide.id} className={`${styles.card} ${!slide.active ? styles.inactive : ''}`}>
                  <div className={styles.cardHeader}>
                    <span className={styles.order}>Order: {slide.order}</span>
                    <span className={styles.backgroundClass}>{slide.backgroundClass}</span>
                  </div>
                  <h3>{slide.title}</h3>
                  <p>{slide.subtitle}</p>
                  <div className={styles.buttons}>
                    <span>Primary: {slide.primaryButtonText}</span>
                    <span>Secondary: {slide.secondaryButtonText}</span>
                  </div>
                  <div className={styles.cardActions}>
                    <span className={`${styles.status} ${slide.active ? styles.active : styles.inactive}`}>
                      {slide.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
