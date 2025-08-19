import { Link } from 'react-router-dom';
import styles from './NotFound.module.scss';

const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>404</h1>
          <h2 className={styles.subtitle}>Page Not Found</h2>
          <p className={styles.description}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className={styles.actions}>
            <Link to="/" className={styles.homeBtn}>
              Go to Homepage
            </Link>
            <Link to="/admin" className={styles.adminBtn}>
              Admin Panel
            </Link>
          </div>
        </div>
        <div className={styles.illustration}>
          <div className={styles.circle}></div>
          <div className={styles.text}>404</div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
