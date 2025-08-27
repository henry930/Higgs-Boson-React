import React, { useState, useEffect } from 'react';
import styles from './AppointmentDashboard.module.scss';

interface Appointment {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  preferred_date: string;
  preferred_time: string;
  message: string;
  status: string;
  created_at: string;
}

interface DashboardData {
  statistics: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
  };
  upcoming: Appointment[];
  recent: Appointment[];
}

const AppointmentDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'recent' | 'all'>('upcoming');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/appointments/dashboard/');
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/appointments/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Refresh dashboard data
        fetchDashboardData();
      } else {
        alert('Failed to update appointment status');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'confirmed': return '#28a745';
      case 'completed': return '#6c757d';
      case 'cancelled': return '#dc3545';
      default: return '#17a2b8';
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!dashboardData) {
    return <div className={styles.error}>No data available</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Appointment Dashboard</h1>
        <button onClick={fetchDashboardData} className={styles.refreshButton}>
          Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Appointments</h3>
          <div className={styles.statNumber}>{dashboardData.statistics.total}</div>
        </div>
        <div className={styles.statCard}>
          <h3>Pending</h3>
          <div className={styles.statNumber} style={{ color: '#ffc107' }}>
            {dashboardData.statistics.pending}
          </div>
        </div>
        <div className={styles.statCard}>
          <h3>Confirmed</h3>
          <div className={styles.statNumber} style={{ color: '#28a745' }}>
            {dashboardData.statistics.confirmed}
          </div>
        </div>
        <div className={styles.statCard}>
          <h3>Completed</h3>
          <div className={styles.statNumber} style={{ color: '#6c757d' }}>
            {dashboardData.statistics.completed}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabNavigation}>
        <button 
          className={`${styles.tab} ${selectedTab === 'upcoming' ? styles.active : ''}`}
          onClick={() => setSelectedTab('upcoming')}
        >
          Upcoming ({dashboardData.upcoming.length})
        </button>
        <button 
          className={`${styles.tab} ${selectedTab === 'recent' ? styles.active : ''}`}
          onClick={() => setSelectedTab('recent')}
        >
          Recent ({dashboardData.recent.length})
        </button>
      </div>

      {/* Appointments List */}
      <div className={styles.appointmentsList}>
        {selectedTab === 'upcoming' && (
          <div>
            <h2>Upcoming Appointments</h2>
            {dashboardData.upcoming.length === 0 ? (
              <p>No upcoming appointments</p>
            ) : (
              dashboardData.upcoming.map((appointment) => (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment}
                  onStatusUpdate={updateAppointmentStatus}
                  formatDate={formatDate}
                  formatDateTime={formatDateTime}
                  getStatusColor={getStatusColor}
                />
              ))
            )}
          </div>
        )}

        {selectedTab === 'recent' && (
          <div>
            <h2>Recent Appointments</h2>
            {dashboardData.recent.length === 0 ? (
              <p>No recent appointments</p>
            ) : (
              dashboardData.recent.map((appointment) => (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment}
                  onStatusUpdate={updateAppointmentStatus}
                  formatDate={formatDate}
                  formatDateTime={formatDateTime}
                  getStatusColor={getStatusColor}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface AppointmentCardProps {
  appointment: Appointment;
  onStatusUpdate: (id: number, status: string) => void;
  formatDate: (date: string) => string;
  formatDateTime: (date: string) => string;
  getStatusColor: (status: string) => string;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ 
  appointment, 
  onStatusUpdate, 
  formatDate, 
  formatDateTime, 
  getStatusColor 
}) => {
  return (
    <div className={styles.appointmentCard}>
      <div className={styles.appointmentHeader}>
        <h3>{appointment.name}</h3>
        <span 
          className={styles.status}
          style={{ backgroundColor: getStatusColor(appointment.status) }}
        >
          {appointment.status.toUpperCase()}
        </span>
      </div>
      
      <div className={styles.appointmentDetails}>
        <div className={styles.contactInfo}>
          <p><strong>Email:</strong> {appointment.email}</p>
          {appointment.phone && <p><strong>Phone:</strong> {appointment.phone}</p>}
          {appointment.company && <p><strong>Company:</strong> {appointment.company}</p>}
        </div>
        
        <div className={styles.appointmentInfo}>
          <p><strong>Service:</strong> {appointment.service}</p>
          <p><strong>Date:</strong> {formatDate(appointment.preferred_date)}</p>
          <p><strong>Time:</strong> {appointment.preferred_time}</p>
          <p><strong>Requested:</strong> {formatDateTime(appointment.created_at)}</p>
        </div>
      </div>

      {appointment.message && (
        <div className={styles.message}>
          <strong>Message:</strong> {appointment.message}
        </div>
      )}

      <div className={styles.actions}>
        {appointment.status === 'pending' && (
          <>
            <button 
              onClick={() => onStatusUpdate(appointment.id, 'confirmed')}
              className={styles.confirmButton}
            >
              Confirm
            </button>
            <button 
              onClick={() => onStatusUpdate(appointment.id, 'cancelled')}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </>
        )}
        {appointment.status === 'confirmed' && (
          <button 
            onClick={() => onStatusUpdate(appointment.id, 'completed')}
            className={styles.completeButton}
          >
            Mark Complete
          </button>
        )}
      </div>
    </div>
  );
};

export default AppointmentDashboard;
