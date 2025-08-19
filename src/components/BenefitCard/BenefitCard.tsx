import Card from '../UI/Card';
import styles from './BenefitCard.module.scss';

interface BenefitCardProps {
  icon: string;
  title: string;
  description: string;
  className?: string;
}

const BenefitCard = ({ icon, title, description, className = '' }: BenefitCardProps) => {
  return (
    <Card hover className={`${styles.benefitCard} ${className}`}>
      <div className={styles.icon}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </Card>
  );
};

export default BenefitCard;
