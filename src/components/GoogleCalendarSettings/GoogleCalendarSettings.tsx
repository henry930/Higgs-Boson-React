// Google Calendar Settings Component
import React, { useState, useEffect } from 'react';
import { useGoogleCalendar } from '../../hooks/useGoogleCalendar';
import styles from './GoogleCalendarSettings.module.scss';

interface GoogleCalendarSettingsProps {
  onConnectionChange?: (connected: boolean) => void;
}

export const GoogleCalendarSettings: React.FC<GoogleCalendarSettingsProps> = ({
  onConnectionChange
}) => {
  const {
    isConnected,
    isLoading,
    error,
    connectCalendar,
    disconnectCalendar,
    checkConnectionStatus
  } = useGoogleCalendar();

  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    onConnectionChange?.(isConnected);
  }, [isConnected, onConnectionChange]);

  const handleConnect = async () => {
    try {
      await connectCalendar();
      setStatusMessage('Calendar connection initiated. Please complete authorization in the popup window.');
    } catch (error) {
      setStatusMessage('Failed to connect to Google Calendar');
    }
  };

  const handleDisconnect = async () => {
    const success = await disconnectCalendar();
    if (success) {
      setStatusMessage('Google Calendar disconnected successfully');
    } else {
      setStatusMessage('Failed to disconnect Google Calendar');
    }
  };

  const handleRefreshStatus = async () => {
    const status = await checkConnectionStatus();
    setStatusMessage(status.message);
  };

  return (
    <div className={styles.calendarSettings}>
      <div className={styles.header}>
        <h3>📅 Google Calendar Integration</h3>
        <p>Connect your Google Calendar to sync appointments automatically</p>
      </div>

      <div className={styles.statusCard}>
        <div className={styles.statusHeader}>
          <div className={styles.statusIndicator}>
            <div className={`${styles.dot} ${isConnected ? styles.connected : styles.disconnected}`} />
            <span className={styles.statusText}>
              {isConnected ? 'Connected' : 'Not Connected'}
            </span>
          </div>
          <button 
            onClick={handleRefreshStatus}
            className={styles.refreshButton}
            disabled={isLoading}
          >
            🔄 Refresh
          </button>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            ⚠️ {error}
          </div>
        )}

        {statusMessage && (
          <div className={styles.statusMessage}>
            ℹ️ {statusMessage}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        {!isConnected ? (
          <button 
            onClick={handleConnect}
            className={styles.connectButton}
            disabled={isLoading}
          >
            {isLoading ? '🔄 Connecting...' : '🔗 Connect Google Calendar'}
          </button>
        ) : (
          <button 
            onClick={handleDisconnect}
            className={styles.disconnectButton}
            disabled={isLoading}
          >
            {isLoading ? '🔄 Disconnecting...' : '🔌 Disconnect Calendar'}
          </button>
        )}
      </div>

      <div className={styles.benefits}>
        <h4>✨ Benefits of Google Calendar Integration:</h4>
        <ul>
          <li>🎯 Real-time availability checking</li>
          <li>📧 Automatic email invitations</li>
          <li>⏰ Smart reminder notifications</li>
          <li>📱 Sync across all devices</li>
          <li>🔄 Two-way calendar sync</li>
          <li>🕐 Timezone handling</li>
        </ul>
      </div>

      <div className={styles.instructions}>
        <h4>🔧 Setup Instructions:</h4>
        <ol>
          <li>Click "Connect Google Calendar"</li>
          <li>Sign in to your Google account</li>
          <li>Grant calendar permissions</li>
          <li>Your appointments will sync automatically!</li>
        </ol>
      </div>
    </div>
  );
};
