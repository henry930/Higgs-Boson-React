import { useEffect } from 'react';
import { useUI } from '../../hooks/ui/useUI';
import styles from './NotificationCenter.module.scss';

const NotificationCenter = () => {
  const { notifications, actions } = useUI();

  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.duration) {
        const timer = setTimeout(() => {
          actions.removeNotification(notification.id);
        }, notification.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications, actions]);

  if (notifications.length === 0) return null;

  return (
    <div className={styles.notificationCenter}>
      {notifications.map(notification => (
        <div 
          key={notification.id} 
          className={`${styles.notification} ${styles[notification.type]}`}
        >
          <div className={styles.notificationContent}>
            <span className={styles.notificationMessage}>
              {notification.message}
            </span>
            <button 
              className={styles.closeButton}
              onClick={() => actions.removeNotification(notification.id)}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationCenter;
