import React from 'react';
import EmbeddedAIChat from '../../components/EmbeddedAIChat/EmbeddedAIChat';
import SEO from '../../components/SEO/SEO';
import styles from './ProjectEstimation.module.scss';

const ProjectEstimation: React.FC = () => {
  return (
    <div className={styles.projectEstimation}>
      <SEO 
        title="Project Estimation"
        description="Get a detailed project estimate through Sarah, our AI Assistant. Comprehensive project estimation for your technology and AI development needs."
        keywords="project estimation, AI project estimation, development cost estimation, project calculator, software development quotes"
        url="https://higgsboson.tech/project-estimation"
      />
      <div className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Project <span className={styles.accent}>Estimation</span></h1>
            <p className={styles.heroDescription}>
              Get a detailed project estimate through Sarah, our AI Assistant. Sarah will guide you through 
              the requirements gathering process and provide a comprehensive project estimation.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.estimationSection}>
        <div className={styles.container}>
          <div className={styles.aiChatContainer}>
            <div className={styles.chatHeader}>
              <div className={styles.headerContent}>
                <h2>👩‍💼 Sarah - AI Project Estimation Assistant</h2>
                <p>Get instant project estimates with Sarah, your AI business consultant</p>
              </div>
              <div className={styles.statusBadge}>
                <span className={styles.onlineIndicator}></span>
                Sarah Online
              </div>
            </div>
            
            <div className={styles.enlargedChatBox}>
              <EmbeddedAIChat />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectEstimation;
