import { Link } from 'react-router-dom';
import { useState } from 'react';
import StackIcon from 'tech-stack-icons';
import SEO from '../../components/SEO/SEO';
import GoogleCalendarScheduler from '../../components/GoogleCalendarScheduler/GoogleCalendarScheduler';
import styles from './Services.module.scss';

// Import custom SVG icons as URLs
import AdobeXdSVG from '../../assets/tech/adobe-xd.svg';
import AnsibleSVG from '../../assets/tech/ansible.svg';
import ApacheSparkSVG from '../../assets/tech/apache-spark.svg';
import BitcoinSVG from '../../assets/tech/bitcoin.svg';
import BootstrapSVG from '../../assets/tech/bootstrap.svg';
import DotnetSVG from '../../assets/tech/dotnet.svg';
import ElasticsearchSVG from '../../assets/tech/elasticsearch.svg';
import EthereumSVG from '../../assets/tech/ethereum.svg';
import ExpressjsSVG from '../../assets/tech/expressjs.svg';
import FastapiSVG from '../../assets/tech/fastapi.svg';
import GithubActionsSVG from '../../assets/tech/github-actions.svg';
import HadoopSVG from '../../assets/tech/hadoop.svg';
import IntellijSVG from '../../assets/tech/intellij.svg';
import IosSVG from '../../assets/tech/ios.svg';
import JavaScriptSVG from '../../assets/tech/javascript.svg';
import JenkinsSVG from '../../assets/tech/jenkins.svg';
import JupyterSVG from '../../assets/tech/jupyter.svg';
import KotlinSVG from '../../assets/tech/kotlin.svg';
import MaterialUiSVG from '../../assets/tech/material-ui.svg';
import MatplotlibSVG from '../../assets/tech/matplotlib.svg';
import NginxSVG from '../../assets/tech/nginx.svg';
import NumpySVG from '../../assets/tech/numpy.svg';
import PandasSVG from '../../assets/tech/pandas.svg';
import PhotoshopSVG from '../../assets/tech/photoshop.svg';
import PolygonSVG from '../../assets/tech/polygon.svg';
import ReactSVG from '../../assets/tech/react.svg';
import ScikitLearnSVG from '../../assets/tech/scikit-learn.svg';
import SqliteSVG from '../../assets/tech/sqlite.svg';
import TableauSVG from '../../assets/tech/tableau.svg';
import TensorFlowSVG from '../../assets/tech/tensorflow.svg';
import TerraformSVG from '../../assets/tech/terraform.svg';
import TrelloSVG from '../../assets/tech/trello.svg';
import ViteSVG from '../../assets/tech/vite.svg';

// Custom icon component for local SVGs
const CustomIcon = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
);

// Default icon component for technologies without custom SVGs
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
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  
  const techCategories = [
    'Frontend', 
    'Backend', 
    'Mobile', 
    'Cloud', 
    'DevOps', 
    'Database', 
    'AI', 
    'Blockchain', 
    'Tools'
  ];

  const teamBuildingServices = [
    {
      title: "AI-powered development",
      description: "Harness the power of AI in development to dramatically reduce project timelines and costs while maintaining exceptional quality.",
      icon: "🤖",
      featured: true
    },
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
      title: "AI Training and Strategies",
      description: "Comprehensive AI training programs and strategic consulting to help your team leverage artificial intelligence effectively in your business operations.",
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
    { 
      name: "React", 
      category: "Frontend", 
      icon: <CustomIcon src={ReactSVG} alt="React" />
    },
    { 
      name: "Vue.js", 
      category: "Frontend", 
      icon: <StackIcon name="vuejs" />
    },
    { 
      name: "Angular", 
      category: "Frontend", 
      icon: <StackIcon name="angular" />
    },
    { 
      name: "TypeScript", 
      category: "Frontend", 
      icon: <StackIcon name="typescript" />
    },
    { 
      name: "Next.js", 
      category: "Frontend", 
      icon: <StackIcon name="nextjs" />
    },
    { name: "Svelte", category: "Frontend", icon: <StackIcon name="sveltejs" /> },
    { name: "Tailwind CSS", category: "Frontend", icon: <StackIcon name="tailwindcss" /> },
    { name: "Sass", category: "Frontend", icon: <StackIcon name="sass" /> },
    
    // Backend
    { 
      name: "Node.js", 
      category: "Backend", 
      icon: <StackIcon name="nodejs" />
    },
    { 
      name: "Python", 
      category: "Backend", 
      icon: <StackIcon name="python" />
    },
    { name: "Java", category: "Backend", icon: <StackIcon name="java" /> },
    { name: "C#", category: "Backend", icon: <StackIcon name="csharp" /> },
    { name: "PHP", category: "Backend", icon: <StackIcon name="php" /> },
    { name: "Go", category: "Backend", icon: <StackIcon name="go" /> },
    
    // Mobile
    { 
      name: "React Native", 
      category: "Mobile", 
      icon: <StackIcon name="react" />
    },
    { 
      name: "Flutter", 
      category: "Mobile", 
      icon: <StackIcon name="flutter" />
    },
    { name: "Swift", category: "Mobile", icon: <StackIcon name="swift" /> },
    { name: "Kotlin", category: "Mobile", icon: <CustomIcon src={KotlinSVG} alt="Kotlin" /> },
    
    // Cloud & DevOps
    { 
      name: "AWS", 
      category: "Cloud", 
      icon: <StackIcon name="aws" />
    },
    { name: "Azure", category: "Cloud", icon: <StackIcon name="azure" /> },
    { name: "GCP", category: "Cloud", icon: <StackIcon name="gcloud" /> },
    { 
      name: "Docker", 
      category: "DevOps", 
      icon: <StackIcon name="docker" />
    },
    { 
      name: "Kubernetes", 
      category: "DevOps", 
      icon: <StackIcon name="kubernetes" />
    },
    { name: "Terraform", category: "DevOps", icon: <CustomIcon src={TerraformSVG} alt="Terraform" /> },
    { name: "Jenkins", category: "DevOps", icon: <CustomIcon src={JenkinsSVG} alt="Jenkins" /> },
    { name: "Git", category: "DevOps", icon: <StackIcon name="git" /> },
    
    // AI & Data
    { name: "TensorFlow", category: "AI", icon: <CustomIcon src={TensorFlowSVG} alt="TensorFlow" /> },
    { name: "PyTorch", category: "AI", icon: <StackIcon name="pytorch" /> },
    { name: "OpenAI", category: "AI", icon: <StackIcon name="openai" /> },
    { name: "LangChain", category: "AI", icon: <DefaultIcon name="LangChain" /> },
    { name: "Pandas", category: "AI", icon: <CustomIcon src={PandasSVG} alt="Pandas" /> },
    { 
      name: "PostgreSQL", 
      category: "Database", 
      icon: <StackIcon name="postgresql" />
    },
    { name: "MongoDB", category: "Database", icon: <StackIcon name="mongodb" /> },
    { name: "MySQL", category: "Database", icon: <StackIcon name="mysql" /> },
    { name: "Redis", category: "Database", icon: <StackIcon name="redis" /> },
    
    // Blockchain
    { 
      name: "Ethereum", 
      category: "Blockchain", 
      icon: <CustomIcon src={EthereumSVG} alt="Ethereum" />
    },
    { name: "Solidity", category: "Blockchain", icon: <StackIcon name="solidity" /> },
    { name: "Web3", category: "Blockchain", icon: <StackIcon name="web3js" /> },
    { name: "Bitcoin", category: "Blockchain", icon: <CustomIcon src={BitcoinSVG} alt="Bitcoin" /> },
    { name: "Polygon", category: "Blockchain", icon: <CustomIcon src={PolygonSVG} alt="Polygon" /> },
    
    // Additional Frontend
    { name: "HTML5", category: "Frontend", icon: <StackIcon name="html5" /> },
    { name: "CSS3", category: "Frontend", icon: <StackIcon name="css3" /> },
    { name: "JavaScript", category: "Frontend", icon: <CustomIcon src={JavaScriptSVG} alt="JavaScript" /> },
    { name: "Webpack", category: "Frontend", icon: <StackIcon name="webpack" /> },
    { name: "Vite", category: "Frontend", icon: <CustomIcon src={ViteSVG} alt="Vite" /> },
    { name: "Nuxt.js", category: "Frontend", icon: <StackIcon name="nuxtjs" /> },
    { name: "Gatsby", category: "Frontend", icon: <StackIcon name="gatsby" /> },
    { name: "Material UI", category: "Frontend", icon: <CustomIcon src={MaterialUiSVG} alt="Material UI" /> },
    { name: "Bootstrap", category: "Frontend", icon: <CustomIcon src={BootstrapSVG} alt="Bootstrap" /> },
    { name: "Styled Components", category: "Frontend", icon: <DefaultIcon name="Styled Components" /> },
    
    // Additional Backend
    { name: "Django", category: "Backend", icon: <StackIcon name="django" /> },
    { name: "Flask", category: "Backend", icon: <StackIcon name="flask" /> },
    { name: "FastAPI", category: "Backend", icon: <CustomIcon src={FastapiSVG} alt="FastAPI" /> },
    { name: "Express.js", category: "Backend", icon: <CustomIcon src={ExpressjsSVG} alt="Express.js" /> },
    { name: "NestJS", category: "Backend", icon: <StackIcon name="nestjs" /> },
    { name: "Spring", category: "Backend", icon: <StackIcon name="spring" /> },
    { name: "Laravel", category: "Backend", icon: <StackIcon name="laravel" /> },
    { name: "Ruby on Rails", category: "Backend", icon: <DefaultIcon name="Ruby on Rails" /> },
    { name: "ASP.NET", category: "Backend", icon: <CustomIcon src={DotnetSVG} alt="ASP.NET" /> },
    { name: "Rust", category: "Backend", icon: <StackIcon name="rust" /> },
    
    // Additional Mobile
    { name: "iOS", category: "Mobile", icon: <CustomIcon src={IosSVG} alt="iOS" /> },
    { name: "Android", category: "Mobile", icon: <StackIcon name="android" /> },
    { name: "Xamarin", category: "Mobile", icon: <DefaultIcon name="Xamarin" /> },
    { name: "Ionic", category: "Mobile", icon: <StackIcon name="ionic" /> },
    { name: "Cordova", category: "Mobile", icon: <DefaultIcon name="Cordova" /> },
    
    // Additional DevOps & Tools
    { name: "GitHub", category: "DevOps", icon: <StackIcon name="github" /> },
    { name: "GitLab", category: "DevOps", icon: <StackIcon name="gitlab" /> },
    { name: "Bitbucket", category: "DevOps", icon: <StackIcon name="bitbucket" /> },
    { name: "CircleCI", category: "DevOps", icon: <DefaultIcon name="CircleCI" /> },
    { name: "GitHub Actions", category: "DevOps", icon: <CustomIcon src={GithubActionsSVG} alt="GitHub Actions" /> },
    { name: "Ansible", category: "DevOps", icon: <CustomIcon src={AnsibleSVG} alt="Ansible" /> },
    { name: "Nginx", category: "DevOps", icon: <CustomIcon src={NginxSVG} alt="Nginx" /> },
    { name: "Apache", category: "DevOps", icon: <StackIcon name="apache" /> },
    { name: "Linux", category: "DevOps", icon: <StackIcon name="linux" /> },
    { name: "Ubuntu", category: "DevOps", icon: <StackIcon name="ubuntu" /> },
    
    // Additional Databases
    { name: "SQLite", category: "Database", icon: <CustomIcon src={SqliteSVG} alt="SQLite" /> },
    { name: "Firebase", category: "Database", icon: <StackIcon name="firebase" /> },
    { name: "Supabase", category: "Database", icon: <DefaultIcon name="Supabase" /> },
    { name: "DynamoDB", category: "Database", icon: <DefaultIcon name="DynamoDB" /> },
    { name: "Elasticsearch", category: "Database", icon: <CustomIcon src={ElasticsearchSVG} alt="Elasticsearch" /> },
    { name: "GraphQL", category: "Database", icon: <StackIcon name="graphql" /> },
    { name: "Prisma", category: "Database", icon: <StackIcon name="prisma" /> },
    
    // Additional AI & Data Science
    { name: "Jupyter", category: "AI", icon: <CustomIcon src={JupyterSVG} alt="Jupyter" /> },
    { name: "Scikit-learn", category: "AI", icon: <CustomIcon src={ScikitLearnSVG} alt="Scikit-learn" /> },
    { name: "NumPy", category: "AI", icon: <CustomIcon src={NumpySVG} alt="NumPy" /> },
    { name: "Matplotlib", category: "AI", icon: <CustomIcon src={MatplotlibSVG} alt="Matplotlib" /> },
    { name: "Apache Spark", category: "AI", icon: <CustomIcon src={ApacheSparkSVG} alt="Apache Spark" /> },
    { name: "Hadoop", category: "AI", icon: <CustomIcon src={HadoopSVG} alt="Hadoop" /> },
    { name: "Tableau", category: "AI", icon: <CustomIcon src={TableauSVG} alt="Tableau" /> },
    { name: "Power BI", category: "AI", icon: <DefaultIcon name="Power BI" /> },
    
    // Additional Tools
    { name: "VS Code", category: "Tools", icon: <StackIcon name="vscode" /> },
    { name: "IntelliJ", category: "Tools", icon: <CustomIcon src={IntellijSVG} alt="IntelliJ" /> },
    { name: "Figma", category: "Tools", icon: <StackIcon name="figma" /> },
    { name: "Adobe XD", category: "Tools", icon: <CustomIcon src={AdobeXdSVG} alt="Adobe XD" /> },
    { name: "Photoshop", category: "Tools", icon: <CustomIcon src={PhotoshopSVG} alt="Photoshop" /> },
    { name: "Slack", category: "Tools", icon: <StackIcon name="slack" /> },
    { name: "Notion", category: "Tools", icon: <StackIcon name="notion" /> },
    { name: "Jira", category: "Tools", icon: <StackIcon name="jira" /> },
    { name: "Trello", category: "Tools", icon: <CustomIcon src={TrelloSVG} alt="Trello" /> },
    { name: "Postman", category: "Tools", icon: <StackIcon name="postman" /> }
  ];

  const faqs = [
    {
      question: "How do you source and vet technical talent?",
      answer: "We use advanced AI-powered screening combined with rigorous technical assessments, code reviews, and cultural fit evaluations. Our multi-stage process ensures only the top 3% of candidates make it to our talent pool."
    },
    {
      question: "Do you provide a human developer to service me?",
      answer: "Yes, absolutely. You'll work with talented specialists selected specifically based on your requirements. We can also provide different experts for various aspects of your project as needed."
    },
    {
      question: "What technologies and frameworks do you specialize in?",
      answer: "We cover the full spectrum of modern technologies including React, Angular, Vue.js, Node.js, Python, Java, AWS, Azure, Docker, Kubernetes, and emerging technologies like AI/ML and blockchain development etc."
    },
    {
      question: "What if my requirements are niche and difficult to find talent for?",
      answer: "Our AI-powered development approach enables us to handle even unprecedented requirements where traditional talent may be scarce. AI assistance bridges skill gaps and accelerates learning curves."
    },
    {
      question: "How quickly can you provide development services?",
      answer: "For most tech stacks, we can provide pre-vetted candidates within 48-72 hours. For niche requirements, we can deploy experienced developers with our AI-powered development process to meet your specific needs."
    },
    {
      question: "What are your engagement models?",
      answer: "We offer flexible engagement models including guaranteed development services, full-time hires, contract-to-hire arrangements, project-based work, and dedicated development teams. Choose what works best for your business needs."
    },
    {
      question: "Do you provide ongoing support after placement?",
      answer: "Yes, we provide continuous support including performance monitoring, regular check-ins, and replacement guarantee to ensure successful long-term placements."
    },
    {
      question: "How does your AI-powered development work?",
      answer: "AI enhances our development process through intelligent code generation, automated testing, performance optimization, and quality assurance, allowing our developers to deliver faster without compromising quality."
    },
    // Original FAQs
    {
      question: "Will outsourcing development result in lower performance than employing a developer?",
      answer: "Not at all. Unless you're a large company specializing in IT development, small teams typically cannot compete with the expertise and resources of professional development teams."
    },
    {
      question: "What are your advantages compared to other competitors?",
      answer: "We leverage AI throughout our development process. Most development tasks are enhanced by AI, allowing our developers to focus on product design, development architecture, testing, and customer service. You receive better service at a lower cost."
    },
    {
      question: "What benefits will I receive if I choose your service?",
      answer: "You'll pay significantly less than traditional salaries and taxes while avoiding all recruitment processes, associated risks, and time investments."
    },
    {
      question: "How do you guarantee your service delivery?",
      answer: "Through AI-powered project estimation, we provide accurate budget and timeline assessments. Weekly evaluations and testing ensure projects stay on track. Direct communication with developers reduces misunderstandings. Most importantly, we offer a money-back guarantee if we cannot deliver according to your requirements."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className={styles.services}>
      <SEO 
        title="Our Services"
        description="Comprehensive AI and technology services including machine learning, data science, software development, and digital transformation solutions for businesses."
        keywords="AI services, machine learning, data science, software development, digital transformation, technology consulting"
        url="https://higgsbosonconsultancy.co.uk/services"
      />
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Complete Development Solutions for <span className={styles.accent}>Every Business Need</span>
            </h1>
                        <p>
              From team building to specialized development, AI integration to business consultation - 
              we provide comprehensive technology services to scale your business.
            </p>
            <div className={styles.heroButtons}>
              <Link to="/schedule-a-call" className={styles.primaryButton}>Get Started</Link>
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
              <div key={index} className={`${styles.serviceCard} ${service.featured ? styles.featuredCard : ''}`}>
                <div className={`${styles.serviceIcon} ${service.featured ? styles.featuredIcon : ''}`}>{service.icon}</div>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDescription}>{service.description}</p>
                <Link to="/schedule-a-call" className={`${styles.serviceButton} ${service.featured ? styles.featuredButton : ''}`}>Learn More</Link>
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
                <Link to="/schedule-a-call" className={styles.developerButton}>Hire Now</Link>
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
                <Link to="/schedule-a-call" className={styles.aiButton}>Get Started</Link>
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
                <button 
                  className={styles.consultationButton} 
                  onClick={() => setCalendarOpen(true)}
                >
                  Schedule Consultation
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stacks" className={styles.techStackSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>All Tech Stacks Supported</h2>
            <p className={styles.sectionDescription}>
              Our developers are proficient in the latest technologies and frameworks across all domains.
            </p>
          </div>
          
          {/* Technology Category Tabs */}
          <div className={styles.techTabs}>
            {techCategories.map((category) => (
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
            {techStacks
              .filter(tech => tech.category === activeTab)
              .map((tech, index) => (
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
              <button 
                className={styles.primaryButton}
                onClick={() => setCalendarOpen(true)}
              >
                Start Your Project
              </button>
              <Link to="/how-it-works" className={styles.secondaryButton}>How It Works</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Google Calendar Booking Modal */}
      <GoogleCalendarScheduler 
        isOpen={calendarOpen}
        onClose={() => setCalendarOpen(false)} 
      />
    </div>
  );
};

export default Services;
