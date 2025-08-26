import { Link } from 'react-router-dom';
import { useState } from 'react';
import styles from './Services.module.scss';

const Services = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const teamBuildingServices = [
    {
      title: "Fractional CTOs",
      description: "Experienced technical leadership to guide your technology strategy and team development.",
      icon: "👨‍💼"
    },
    {
      title: "HR Recruitment",
      description: "Specialized tech recruitment services to find and hire the best talent for your team.",
      icon: "🤝"
    },
    {
      title: "Project Management",
      description: "Professional project management to ensure your development projects are delivered on time.",
      icon: "📋"
    },
    {
      title: "Fund Seeking",
      description: "Support in preparing technical documentation and presentations for investor meetings.",
      icon: "💰"
    },
    {
      title: "IT Training",
      description: "Comprehensive training programs to upskill your existing team on latest technologies.",
      icon: "🎓"
    }
  ];

  const specialistDevelopers = [
    {
      title: "Mobile Developers",
      description: "iOS and Android app development specialists",
      icon: "📱"
    },
    {
      title: "QA Analysts and Testers",
      description: "Quality assurance and testing professionals",
      icon: "🧪"
    },
    {
      title: "DevOps Developers",
      description: "Infrastructure and deployment automation experts",
      icon: "⚙️"
    },
    {
      title: "Data Scientists",
      description: "Analytics and machine learning specialists",
      icon: "📊"
    },
    {
      title: "Vibe Developers",
      description: "Modern full-stack development with latest frameworks",
      icon: "⚡"
    },
    {
      title: "Full-Stack Developers",
      description: "End-to-end web application development",
      icon: "💻"
    },
    {
      title: "Cloud Developers",
      description: "Cloud-native application and infrastructure specialists",
      icon: "☁️"
    },
    {
      title: "Front-end Developers",
      description: "User interface and user experience specialists",
      icon: "🎨"
    },
    {
      title: "Back-end Developers",
      description: "Server-side logic and database specialists",
      icon: "�"
    },
    {
      title: "Windows App Developers",
      description: "Desktop application development for Windows platform",
      icon: "🖥️"
    },
    {
      title: "Game Developers",
      description: "Gaming application and interactive experience developers",
      icon: "🎮"
    },
    {
      title: "Blockchain Developers",
      description: "Cryptocurrency and distributed ledger technology experts",
      icon: "🔗"
    }
  ];

  const aiServices = [
    {
      title: "AI Assistant Development",
      description: "Custom AI assistants and chatbots tailored to your business needs and workflows.",
      icon: "🤖"
    },
    {
      title: "AI Consulting",
      description: "Strategic guidance on AI implementation, technology selection, and business integration.",
      icon: "💡"
    },
    {
      title: "AI Training",
      description: "Comprehensive training programs to help your team understand and work with AI technologies.",
      icon: "🎯"
    }
  ];

  const consultationServices = [
    {
      title: "Business Model Evaluation",
      description: "Comprehensive analysis of your business model and technology requirements for optimal market fit.",
      icon: "📈"
    },
    {
      title: "MVP Design",
      description: "Minimum viable product design and development strategy to quickly validate your ideas.",
      icon: "🚀"
    },
    {
      title: "Business Proposal Draft",
      description: "Professional business proposals and technical documentation for investors and stakeholders.",
      icon: "📝"
    }
  ];

  const techStacks = [
    // Frontend
    { name: "React", category: "Frontend", icon: "⚛️" },
    { name: "Vue.js", category: "Frontend", icon: "💚" },
    { name: "Angular", category: "Frontend", icon: "🅰️" },
    { name: "TypeScript", category: "Frontend", icon: "🔷" },
    { name: "Next.js", category: "Frontend", icon: "▲" },
    { name: "Svelte", category: "Frontend", icon: "🧡" },
    
    // Backend
    { name: "Node.js", category: "Backend", icon: "💚" },
    { name: "Python", category: "Backend", icon: "�" },
    { name: "Java", category: "Backend", icon: "☕" },
    { name: "C#", category: "Backend", icon: "🔷" },
    { name: "PHP", category: "Backend", icon: "🐘" },
    { name: "Go", category: "Backend", icon: "🐹" },
    
    // Mobile
    { name: "React Native", category: "Mobile", icon: "📱" },
    { name: "Flutter", category: "Mobile", icon: "💙" },
    { name: "Swift", category: "Mobile", icon: "🦉" },
    { name: "Kotlin", category: "Mobile", icon: "🟠" },
    
    // Cloud & DevOps
    { name: "AWS", category: "Cloud", icon: "☁️" },
    { name: "Azure", category: "Cloud", icon: "🔵" },
    { name: "GCP", category: "Cloud", icon: "🌈" },
    { name: "Docker", category: "DevOps", icon: "🐳" },
    { name: "Kubernetes", category: "DevOps", icon: "⚓" },
    { name: "Terraform", category: "DevOps", icon: "🏗️" },
    
    // AI & Data
    { name: "TensorFlow", category: "AI", icon: "🧠" },
    { name: "PyTorch", category: "AI", icon: "🔥" },
    { name: "OpenAI", category: "AI", icon: "🤖" },
    { name: "LangChain", category: "AI", icon: "🔗" },
    { name: "Pandas", category: "Data", icon: "🐼" },
    { name: "PostgreSQL", category: "Database", icon: "🐘" },
    
    // Blockchain
    { name: "Ethereum", category: "Blockchain", icon: "💎" },
    { name: "Solidity", category: "Blockchain", icon: "🔐" },
    { name: "Web3", category: "Blockchain", icon: "🌐" }
  ];

  const faqs = [
    {
      question: "Will outsourcing development have less performance than employing a developer?",
      answer: "Certainly not. Unless you are big companies, and specializing in IT development, otherwise, your small team developers can't compete with large teams professional."
    },
    {
      question: "What's your edges comparing to other competitors?",
      answer: "We are using AI on our development. Most of our development tasks can be tackled by AI. Developers can more focus on product design, development architecture, testing and customer service. You can pay a less price for better service."
    },
    {
      question: "What benefits I can have if chosen your service?",
      answer: "You pay extremely lower than salaries and taxes. Waive all recruitment processes and those risks and times."
    },
    {
      question: "How you can guarantee your service delivery?",
      answer: "By using AI project estimation, we can evaluate a good fit budget and time for you. Weekly evaluation and test can make sure your projects would not have distortion. Direct communication with developers can reduce mis-understanding. Most important, we will return your money if we can't deliver on your requirement."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className={styles.services}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Complete Development Solutions for <span className={styles.accent}>Every Business Need</span>
            </h1>
            <p className={styles.heroDescription}>
              From team building to specialized development, AI integration to business consultation - 
              we provide comprehensive technology services to scale your business.
            </p>
            <div className={styles.heroButtons}>
              <Link to="/contact" className={styles.primaryButton}>Get Started</Link>
              <Link to="/price-comparison" className={styles.secondaryButton}>View Pricing</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Team Building Section */}
      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Team Building & Leadership</h2>
            <p className={styles.sectionDescription}>
              Build and scale your technology team with expert leadership and strategic support.
            </p>
          </div>
          
          <div className={styles.servicesGrid}>
            {teamBuildingServices.map((service, index) => (
              <div key={index} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>{service.icon}</div>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDescription}>{service.description}</p>
                <Link to="/contact" className={styles.serviceButton}>Learn More</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialist Developers Section */}
      <section className={`${styles.servicesSection} ${styles.developersSection}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Specialist Developers</h2>
            <p className={styles.sectionDescription}>
              Access top-tier developers specialized in your technology stack and industry requirements.
            </p>
          </div>
          
          <div className={styles.developersGrid}>
            {specialistDevelopers.map((developer, index) => (
              <div key={index} className={styles.developerCard}>
                <div className={styles.developerIcon}>{developer.icon}</div>
                <h3 className={styles.developerTitle}>{developer.title}</h3>
                <p className={styles.developerDescription}>{developer.description}</p>
                <Link to="/contact" className={styles.developerButton}>Hire Now</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Services Section */}
      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>AI Support & Integration</h2>
            <p className={styles.sectionDescription}>
              Leverage artificial intelligence to transform your business processes and customer experiences.
            </p>
          </div>
          
          <div className={styles.aiGrid}>
            {aiServices.map((service, index) => (
              <div key={index} className={styles.aiCard}>
                <div className={styles.aiIcon}>{service.icon}</div>
                <h3 className={styles.aiTitle}>{service.title}</h3>
                <p className={styles.aiDescription}>{service.description}</p>
                <Link to="/contact" className={styles.aiButton}>Get Started</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Section */}
      <section className={`${styles.servicesSection} ${styles.consultationSection}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Business Consultation</h2>
            <p className={styles.sectionDescription}>
              Strategic guidance to validate your ideas, plan your technology roadmap, and prepare for growth.
            </p>
          </div>
          
          <div className={styles.consultationGrid}>
            {consultationServices.map((service, index) => (
              <div key={index} className={styles.consultationCard}>
                <div className={styles.consultationIcon}>{service.icon}</div>
                <h3 className={styles.consultationTitle}>{service.title}</h3>
                <p className={styles.consultationDescription}>{service.description}</p>
                <Link to="/contact" className={styles.consultationButton}>Schedule Consultation</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className={styles.techStackSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>All Tech Stacks Supported</h2>
            <p className={styles.sectionDescription}>
              Our developers are proficient in the latest technologies and frameworks across all domains.
            </p>
          </div>
          
          <div className={styles.techStackGrid}>
            {techStacks.map((tech, index) => (
              <div key={index} className={styles.techStackItem}>
                <div className={styles.techIcon}>{tech.icon}</div>
                <span className={styles.techName}>{tech.name}</span>
                <span className={styles.techCategory}>{tech.category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <p className={styles.sectionDescription}>
              Common questions about our services, pricing, and engagement models.
            </p>
          </div>
          
          <div className={styles.faqList}>
            {faqs.map((faq, index) => (
              <div key={index} className={styles.faqItem}>
                <button 
                  className={`${styles.faqQuestion} ${openFAQ === index ? styles.active : ''}`}
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.question}
                  <span className={styles.faqToggle}>{openFAQ === index ? '−' : '+'}</span>
                </button>
                {openFAQ === index && (
                  <div className={styles.faqAnswer}>
                    {faq.answer}
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
            <h2 className={styles.ctaTitle}>Ready to Transform Your Business?</h2>
            <p className={styles.ctaDescription}>
              Get started with our comprehensive development services and experienced team today.
            </p>
            <div className={styles.ctaButtons}>
              <Link to="/contact" className={styles.primaryButton}>Start Your Project</Link>
              <Link to="/how-it-works" className={styles.secondaryButton}>How It Works</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
