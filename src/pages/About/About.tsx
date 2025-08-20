import { useEffect, useState } from 'react';
import BenefitCard from '../../components/BenefitCard/BenefitCard';
import { useTeam } from '../../hooks/about/useTeam';
import styles from './About.module.scss';

// Fallback dummy data for team members
const fallbackTeamMembers = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    position: "Chief AI Scientist",
    bio: "Dr. Chen leads our AI research initiatives with over 15 years of experience in machine learning and neural networks. She holds a PhD in Computer Science from MIT and has published 50+ papers in top-tier conferences.",
    image_url: "",
    linkedin_url: "",
    twitter_url: "",
    email: "",
    specialties: "Machine Learning, Deep Learning, Natural Language Processing, Computer Vision",
    years_experience: 15,
    education: "PhD Computer Science, MIT; MS Mathematics, Stanford",
    order: 1,
    active: true,
    created_at: "",
    updated_at: ""
  },
  {
    id: 2,
    name: "Marcus Johnson",
    position: "Lead Software Engineer",
    bio: "Marcus is a full-stack development expert with 12 years of experience building scalable web applications and leading engineering teams. He specializes in modern web technologies and cloud architecture.",
    image_url: "",
    linkedin_url: "",
    twitter_url: "",
    email: "",
    specialties: "Full-Stack Development, Cloud Architecture, DevOps, Team Leadership",
    years_experience: 12,
    education: "MS Computer Science, Carnegie Mellon",
    order: 2,
    active: true,
    created_at: "",
    updated_at: ""
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    position: "Data Science Director",
    bio: "Emily brings over 10 years of experience in data science and business intelligence. She has led data transformation projects for Fortune 500 companies and specializes in predictive analytics.",
    image_url: "",
    linkedin_url: "",
    twitter_url: "",
    email: "",
    specialties: "Data Science, Business Intelligence, Predictive Analytics, Machine Learning",
    years_experience: 10,
    education: "PhD Statistics, Berkeley; MS Data Science, Northwestern",
    order: 3,
    active: true,
    created_at: "",
    updated_at: ""
  },
  {
    id: 4,
    name: "James Kim",
    position: "DevOps Engineer",
    bio: "James is a cloud infrastructure specialist with expertise in AWS, Azure, and containerization technologies. He ensures our development and deployment processes are efficient and scalable.",
    image_url: "",
    linkedin_url: "",
    twitter_url: "",
    email: "",
    specialties: "Cloud Infrastructure, Containerization, CI/CD, Infrastructure as Code",
    years_experience: 8,
    education: "BS Computer Engineering, UCLA",
    order: 4,
    active: true,
    created_at: "",
    updated_at: ""
  }
];

const About = () => {
  const { teamMembers, actions, error } = useTeam();
  const [displayTeamMembers, setDisplayTeamMembers] = useState(fallbackTeamMembers);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    actions.fetch();
  }, [actions]);

  useEffect(() => {
    if (teamMembers && teamMembers.length > 0) {
      setDisplayTeamMembers(teamMembers);
      setUsingFallback(false);
    } else if (error) {
      console.log('API error, using fallback team data:', error);
      setDisplayTeamMembers(fallbackTeamMembers);
      setUsingFallback(true);
    }
  }, [teamMembers, error]);

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
      description: 'Grew to 25+ AI specialists and opened offices in New York and London.'
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
      <div className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.title}>Pioneering the Future of AI Development</h1>
          <p className={styles.subtitle}>
            Founded by AI researchers and industry veterans, Higgs Boson Consultancy is dedicated
            to transforming businesses through intelligent automation and cutting-edge technology.
          </p>
        </div>
      </div>

      <div className={styles.missionSection}>
        <div className={styles.container}>
          <div className={styles.missionGrid}>
            <div className={styles.missionContent}>
              <h2>Our Mission</h2>
              <p>
                To democratize artificial intelligence and make enterprise-grade AI solutions
                accessible to businesses of all sizes. We believe that every company, regardless
                of size or industry, should have access to the transformative power of AI.
              </p>
              <p>
                Through our unique combination of human expertise and AI-accelerated development,
                we deliver solutions that are not only technically superior but also cost-effective
                and delivered in record time.
              </p>
            </div>
            <div className={styles.missionStats}>
              <div className={styles.stat}>
                <div className={styles.statNumber}>100+</div>
                <div className={styles.statLabel}>Projects Delivered</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>75%</div>
                <div className={styles.statLabel}>Faster Delivery</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>50+</div>
                <div className={styles.statLabel}>Enterprise Clients</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statNumber}>99.9%</div>
                <div className={styles.statLabel}>Uptime Guarantee</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.valuesSection}>
        <div className={styles.container}>
          <h2>Our Values</h2>
          <div className={styles.valuesGrid}>
            {values.map((value, index) => (
              <BenefitCard
                key={index}
                icon={value.icon}
                title={value.title}
                description={value.description}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.timelineSection}>
        <div className={styles.container}>
          <h2>Our Journey</h2>
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

      <div className={styles.teamSection}>
        <div className={styles.container}>
          {usingFallback && (
            <div className={styles.notification}>
              <p>⚠️ Unable to connect to server. Showing sample team data.</p>
            </div>
          )}
          <h2>Meet Our Team</h2>
          <p className={styles.teamIntro}>
            Our diverse team of AI researchers, software engineers, and business strategists
            brings together decades of experience from top technology companies and research institutions.
          </p>
          <div className={styles.teamGrid}>
            {displayTeamMembers.map((member, index) => (
              <div key={member.id || index} className={styles.teamCard}>
                <div className={styles.memberImage}>
                  {member.image_url ? (
                    <img src={member.image_url} alt={member.name} />
                  ) : (
                    <div className={styles.placeholder}>👤</div>
                  )}
                </div>
                <h3>{member.name}</h3>
                <div className={styles.memberRole}>{member.position}</div>
                <p>{member.bio}</p>
                {member.specialties && (
                  <div className={styles.specialties}>
                    <strong>Specialties:</strong> {member.specialties}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.ctaSection}>
        <div className={styles.container}>
          <h2>Ready to Transform Your Business?</h2>
          <p>
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
  );
};

export default About;
