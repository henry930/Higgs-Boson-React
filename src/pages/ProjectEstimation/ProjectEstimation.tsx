import React from 'react';
import EmbeddedAIChat from '../../components/EmbeddedAIChat/EmbeddedAIChat';
import SEO from '../../components/SEO/SEO';
import styles from './ProjectEstimation.module.scss';

const ProjectEstimation: React.FC = () => {
  return (
    <div className={styles.projectEstimation}>
      <SEO 
        title="AI-Powered Project Advice & Estimation"
        description="Get expert project advice and accurate estimates for AI-powered software development. Consult with our AI assistant for technology recommendations, planning guidance, and cost estimates with 40-60% faster delivery using AI agents."
        keywords="AI-powered development, project advice, development consultation, project estimation, development cost calculator, AI project planning, software development estimate, technology recommendations, GitHub Copilot development"
        url="https://higgsbosonconsultancy.co.uk/project-estimation"
      />
      <div className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>AI-Powered Project <span className={styles.accent}>Advice & Estimation</span></h1>
            <p className={styles.heroDescription}>
              Get expert project advice and detailed estimates through Sarah, our AI Business Consultant. 
              Sarah provides technology recommendations, planning guidance, risk assessment, and comprehensive project estimations with AI development advantages.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.estimationSection}>
        <div className={styles.container}>
          <div className={styles.aiChatContainer}>
            <div className={styles.chatHeader}>
              <div className={styles.headerContent}>
                <h2>🤖 Sarah - AI-Powered Project Advisor & Development Consultant</h2>
                <p>Get expert advice, technology recommendations, and instant estimates with AI development advantages (40-60% faster delivery)</p>
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
