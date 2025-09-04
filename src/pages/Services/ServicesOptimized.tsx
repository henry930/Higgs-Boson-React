import { Link } from 'react-router-dom';
import { useState, lazy, Suspense } from 'react';
import StackIcon from 'tech-stack-icons';
import styles from './Services.module.scss';

// Lazy load the Google calendar component
const GoogleCalendarScheduler = lazy(() => import('../../components/GoogleCalendarScheduler/GoogleCalendarScheduler'));

// Simple icon fallback component
const DefaultIcon = ({ name }: { name: string }) => (
  <div style={{ 
    width: '100%', 
    height: '100%', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px',
    textTransform: 'uppercase'
  }}>
    {name.substring(0, 2)}
  </div>
);

const Services = () => {
  console.log('🏢 Services page component mounted/rendered');
  
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>('Frontend');
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  
  console.log('📋 bookingModalOpen state:', bookingModalOpen);
  
  const techCategories = [
    'Frontend', 
    'Backend', 
    'Mobile', 
    'Cloud', 
    'DevOps', 
    'AI', 
    'Database', 
    'Blockchain', 
    'Tools'
  ];

  // Optimized technologies list - only most important ones, using mostly StackIcon
  const technologies = [
    // Frontend - Most Essential
    { name: "React", category: "Frontend", icon: <StackIcon name="react" /> },
    { name: "Vue.js", category: "Frontend", icon: <StackIcon name="vuejs" /> },
    { name: "Angular", category: "Frontend", icon: <StackIcon name="angular" /> },
    { name: "TypeScript", category: "Frontend", icon: <StackIcon name="typescript" /> },
    { name: "Next.js", category: "Frontend", icon: <StackIcon name="nextjs" /> },
    { name: "Svelte", category: "Frontend", icon: <StackIcon name="sveltejs" /> },
    { name: "Tailwind CSS", category: "Frontend", icon: <StackIcon name="tailwindcss" /> },
    { name: "Sass", category: "Frontend", icon: <StackIcon name="sass" /> },
    { name: "HTML5", category: "Frontend", icon: <StackIcon name="html5" /> },
    { name: "CSS3", category: "Frontend", icon: <StackIcon name="css3" /> },
    { name: "JavaScript", category: "Frontend", icon: <StackIcon name="javascript" /> },
    { name: "Webpack", category: "Frontend", icon: <StackIcon name="webpack" /> },
    
    // Backend - Most Essential
    { name: "Node.js", category: "Backend", icon: <StackIcon name="nodejs" /> },
    { name: "Python", category: "Backend", icon: <StackIcon name="python" /> },
    { name: "Java", category: "Backend", icon: <StackIcon name="java" /> },
    { name: "C#", category: "Backend", icon: <StackIcon name="csharp" /> },
    { name: "PHP", category: "Backend", icon: <StackIcon name="php" /> },
    { name: "Go", category: "Backend", icon: <StackIcon name="go" /> },
    { name: "Django", category: "Backend", icon: <StackIcon name="django" /> },
    { name: "Flask", category: "Backend", icon: <StackIcon name="flask" /> },
    { name: "NestJS", category: "Backend", icon: <StackIcon name="nestjs" /> },
    { name: "Spring", category: "Backend", icon: <StackIcon name="spring" /> },
    { name: "Laravel", category: "Backend", icon: <StackIcon name="laravel" /> },
    { name: "Ruby on Rails", category: "Backend", icon: <DefaultIcon name="Rails" /> },
    
    // Mobile - Essential
    { name: "React Native", category: "Mobile", icon: <StackIcon name="react" /> },
    { name: "Flutter", category: "Mobile", icon: <StackIcon name="flutter" /> },
    { name: "Swift", category: "Mobile", icon: <StackIcon name="swift" /> },
    { name: "Android", category: "Mobile", icon: <StackIcon name="android" /> },
    { name: "Ionic", category: "Mobile", icon: <StackIcon name="ionic" /> },
    
    // Cloud - Essential
    { name: "AWS", category: "Cloud", icon: <StackIcon name="aws" /> },
    { name: "Azure", category: "Cloud", icon: <StackIcon name="azure" /> },
    { name: "GCP", category: "Cloud", icon: <StackIcon name="gcloud" /> },
    
    // DevOps - Essential
    { name: "Docker", category: "DevOps", icon: <StackIcon name="docker" /> },
    { name: "Kubernetes", category: "DevOps", icon: <StackIcon name="kubernetes" /> },
    { name: "Git", category: "DevOps", icon: <StackIcon name="git" /> },
    { name: "GitHub", category: "DevOps", icon: <StackIcon name="github" /> },
    { name: "GitLab", category: "DevOps", icon: <StackIcon name="gitlab" /> },
    { name: "Linux", category: "DevOps", icon: <StackIcon name="linux" /> },
    { name: "Ubuntu", category: "DevOps", icon: <StackIcon name="ubuntu" /> },
    
    // AI - Essential
    { name: "TensorFlow", category: "AI", icon: <StackIcon name="tensorflow" /> },
    { name: "PyTorch", category: "AI", icon: <StackIcon name="pytorch" /> },
    { name: "OpenAI", category: "AI", icon: <StackIcon name="openai" /> },
    { name: "LangChain", category: "AI", icon: <DefaultIcon name="LC" /> },
    
    // Database - Essential
    { name: "PostgreSQL", category: "Database", icon: <StackIcon name="postgresql" /> },
    { name: "MongoDB", category: "Database", icon: <StackIcon name="mongodb" /> },
    { name: "MySQL", category: "Database", icon: <StackIcon name="mysql" /> },
    { name: "Redis", category: "Database", icon: <StackIcon name="redis" /> },
    { name: "Firebase", category: "Database", icon: <StackIcon name="firebase" /> },
    { name: "GraphQL", category: "Database", icon: <StackIcon name="graphql" /> },
    { name: "Prisma", category: "Database", icon: <StackIcon name="prisma" /> },
    
    // Blockchain - Essential
    { name: "Ethereum", category: "Blockchain", icon: <DefaultIcon name="ETH" /> },
    { name: "Solidity", category: "Blockchain", icon: <StackIcon name="solidity" /> },
    { name: "Web3", category: "Blockchain", icon: <StackIcon name="web3js" /> },
    { name: "Bitcoin", category: "Blockchain", icon: <DefaultIcon name="BTC" /> },
    
    // Tools - Essential
    { name: "VS Code", category: "Tools", icon: <StackIcon name="vscode" /> },
    { name: "Figma", category: "Tools", icon: <StackIcon name="figma" /> },
    { name: "Slack", category: "Tools", icon: <StackIcon name="slack" /> },
    { name: "Notion", category: "Tools", icon: <StackIcon name="notion" /> },
    { name: "Jira", category: "Tools", icon: <StackIcon name="jira" /> },
    { name: "Postman", category: "Tools", icon: <StackIcon name="postman" /> }
  ];

  const faqs = [
    {
      question: "How do you source and vet technical talent?",
      answer: "We use advanced AI-powered screening combined with rigorous technical assessments, code reviews, and cultural fit evaluations. Our multi-stage process ensures only the top 3% of candidates make it to our talent pool."
    },
    {
      question: "What technologies and frameworks do you specialize in?",
      answer: "We cover the full spectrum of modern technologies including React, Angular, Vue.js, Node.js, Python, Java, AWS, Azure, Docker, Kubernetes, and emerging technologies like AI/ML and blockchain development."
    },
    {
      question: "How quickly can you provide developers?",
      answer: "For most technologies, we can provide pre-vetted candidates within 48-72 hours. For specialized or niche requirements, it typically takes 1-2 weeks to find the perfect match."
    },
    {
      question: "What are your engagement models?",
      answer: "We offer flexible engagement models including full-time hires, contract-to-hire, project-based work, and dedicated development teams. Choose what works best for your business needs."
    },
    {
      question: "Do you provide ongoing support after placement?",
      answer: "Yes, we provide continuous support including performance monitoring, regular check-ins, and replacement guarantee for the first 90 days to ensure successful long-term placements."
    },
    {
      question: "How does your AI-powered development work?",
      answer: "Our AI enhances the development process through intelligent code generation, automated testing, performance optimization, and quality assurance, allowing our developers to deliver faster without compromising quality."
    }
  ];

  const filteredTechnologies = technologies.filter(tech => tech.category === activeTab);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const openBookingModal = () => {
    console.log('🎯 Opening booking modal');
    setBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    console.log('🚪 Closing booking modal');
    setBookingModalOpen(false);
  };

  return (
    <div className={styles.services}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Premium Technical <span className={styles.accent}>Talent Solutions</span>
            </h1>
            <p className={styles.heroDescription}>
              Access top-tier developers, engineers, and technical specialists with AI-enhanced capabilities. 
              Scale your team faster, build better products, and stay ahead of the competition.
            </p>
            <div className={styles.heroButtons}>
              <button onClick={openBookingModal} className={styles.primaryButton}>
                Schedule Consultation
              </button>
              <Link to="/how-it-works" className={styles.secondaryButton}>
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Core Services</h2>
          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>👨‍💻</div>
              <h3>Full-Stack Development</h3>
              <p>Complete web and mobile application development with modern frameworks and technologies.</p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>☁️</div>
              <h3>Cloud Solutions</h3>
              <p>Scalable cloud architecture, DevOps, and infrastructure management on AWS, Azure, and GCP.</p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🤖</div>
              <h3>AI & Machine Learning</h3>
              <p>Advanced AI solutions, data science, and machine learning model development and deployment.</p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🔒</div>
              <h3>Blockchain Development</h3>
              <p>Smart contracts, DApps, and blockchain solutions for Web3 and cryptocurrency projects.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className={styles.techStackSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Technologies We Master</h2>
          <div className={styles.techTabs}>
            {techCategories.map(category => (
              <button
                key={category}
                className={`${styles.techTab} ${activeTab === category ? styles.techTabActive : ''}`}
                onClick={() => setActiveTab(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className={styles.techStackGrid}>
            {filteredTechnologies.map((tech, index) => (
              <div key={`${tech.name}-${index}`} className={styles.techStackItem}>
                <div className={styles.techIcon}>
                  <Suspense fallback={<DefaultIcon name={tech.name} />}>
                    {tech.icon}
                  </Suspense>
                </div>
                <span className={styles.techName}>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Why Choose Our Talent?</h2>
          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>⚡</div>
              <h3>AI-Enhanced Development</h3>
              <p>Our developers leverage cutting-edge AI tools to deliver 40% faster development cycles while maintaining exceptional quality standards.</p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🎯</div>
              <h3>Pre-Vetted Excellence</h3>
              <p>Rigorous 5-stage screening process ensures only the top 3% of technical talent joins our exclusive network.</p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🔄</div>
              <h3>Flexible Engagement</h3>
              <p>From short-term projects to long-term partnerships, we adapt to your specific business needs and timeline.</p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>📈</div>
              <h3>Proven Track Record</h3>
              <p>97% client satisfaction rate with successful projects delivered across startups to Fortune 500 companies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {faqs.map((faq, index) => (
              <div key={index} className={styles.faqItem}>
                <button
                  className={styles.faqQuestion}
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{faq.question}</span>
                  <span className={`${styles.faqToggle} ${openFAQ === index ? styles.open : ''}`}>
                    +
                  </span>
                </button>
                {openFAQ === index && (
                  <div className={styles.faqAnswer}>
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Scale Your Technical Team?</h2>
            <p className={styles.ctaDescription}>Join hundreds of companies that trust us to deliver exceptional technical talent.</p>
            <div className={styles.ctaButtons}>
              <button onClick={openBookingModal} className={styles.primaryButton}>
                Get Started Today
              </button>
              <Link to="/schedule-a-call" className={styles.secondaryButton}>
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {bookingModalOpen && (
        <div className={styles.modalOverlay} onClick={closeBookingModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.modalCloseButton} 
              onClick={closeBookingModal}
              aria-label="Close modal"
            >
              ×
            </button>
            <Suspense fallback={<div>Loading booking calendar...</div>}>
              <GoogleCalendarScheduler isOpen={bookingModalOpen} onClose={closeBookingModal} />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
