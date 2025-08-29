import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FullAdminDashboard.module.scss';

interface DashboardStats {
  appointments: {
    total: number;
    pending: number;
    confirmed: number;
    today: number;
  };
  applications: {
    total: number;
    new: number;
    reviewing: number;
    interview: number;
  };
  recent_appointments: Appointment[];
  recent_applications: JobApplication[];
}

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
  meeting_link: string;
  notes: string;
  created_at: string;
}

interface JobApplication {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  cover_letter: string;
  cv: string;
  linkedin: string;
  portfolio: string;
  status: string;
  notes: string;
  parsed_name: string;
  parsed_email: string;
  parsed_phone: string;
  parsed_linkedin: string;
  parsed_skills: string;
  parsed_experience_years: string;
  parsed_education: string;
  parsed_summary: string;
  cv_text_preview: string;
  cv_parsed_at: string;
  cv_parse_success: boolean;
  cv_parse_error: string;
  created_at: string;
}

interface CVScanResults {
  message: string;
  data?: {
    processed_files: number;
    created_applications: number;
    errors: Array<{
      filename: string;
      error: string;
    }>;
  };
}

const FullAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'applications' | 'cv-scan'>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [cvScanDirectory, setCvScanDirectory] = useState('/workspaces/Higgs-Boson-React/CV');
  const [cvScanResults, setCvScanResults] = useState<CVScanResults | null>(null);

  useEffect(() => {
    checkAuthAndFetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuthAndFetchData = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    await fetchDashboardData();
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      // Fetch overview stats
      const statsResponse = await fetch('/api/admin/dashboard/overview/', {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.data);
      }

      // Fetch appointments
      const appointmentsResponse = await fetch('/api/admin/appointments/', {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (appointmentsResponse.ok) {
        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData.results || appointmentsData);
      }

      // Fetch applications
      const applicationsResponse = await fetch('/api/admin/job-applications/', {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (applicationsResponse.ok) {
        const applicationsData = await applicationsResponse.json();
        setApplications(applicationsData.results || applicationsData);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/');
  };

  const updateAppointmentStatus = async (appointmentId: number, status: string, meetingLink?: string, notes?: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/appointments/${appointmentId}/update_status/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, meeting_link: meetingLink, notes }),
      });

      if (response.ok) {
        await fetchDashboardData();
        setSelectedAppointment(null);
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const updateApplicationStatus = async (applicationId: number, status: string, notes?: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/job-applications/${applicationId}/update_status/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notes }),
      });

      if (response.ok) {
        await fetchDashboardData();
        setSelectedApplication(null);
      }
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  const parseCV = async (applicationId: number) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/job-applications/${applicationId}/parse_cv/`, {
        method: 'POST',
        headers: { 'Authorization': `Token ${token}` },
      });

      if (response.ok) {
        await fetchDashboardData();
      }
    } catch (error) {
      console.error('Error parsing CV:', error);
    }
  };

  const bulkParseCVs = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/job-applications/bulk_parse_cvs/', {
        method: 'POST',
        headers: { 'Authorization': `Token ${token}` },
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        await fetchDashboardData();
      }
    } catch (error) {
      console.error('Error bulk parsing CVs:', error);
    }
  };

  const scanCVDirectory = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/job-applications/scan_cv_directory/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ directory: cvScanDirectory }),
      });

      const result = await response.json();
      setCvScanResults(result);
      
      if (response.ok) {
        await fetchDashboardData();
      }
    } catch (error) {
      console.error('Error scanning CV directory:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'pending': '#f59e0b',
      'confirmed': '#10b981',
      'completed': '#6b7280',
      'cancelled': '#ef4444',
      'new': '#3b82f6',
      'reviewing': '#f59e0b',
      'interview': '#8b5cf6',
      'accepted': '#10b981',
      'rejected': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Admin Dashboard</h1>
        <div className={styles.headerActions}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'appointments' ? styles.active : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          Appointments ({appointments.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'applications' ? styles.active : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          Job Applications ({applications.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'cv-scan' ? styles.active : ''}`}
          onClick={() => setActiveTab('cv-scan')}
        >
          CV Scanner
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && stats && (
        <div className={styles.overview}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>Total Appointments</h3>
              <p className={styles.statNumber}>{stats.appointments.total}</p>
              <div className={styles.statBreakdown}>
                <span>Pending: {stats.appointments.pending}</span>
                <span>Confirmed: {stats.appointments.confirmed}</span>
                <span>Today: {stats.appointments.today}</span>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <h3>Job Applications</h3>
              <p className={styles.statNumber}>{stats.applications.total}</p>
              <div className={styles.statBreakdown}>
                <span>New: {stats.applications.new}</span>
                <span>Reviewing: {stats.applications.reviewing}</span>
                <span>Interview: {stats.applications.interview}</span>
              </div>
            </div>
          </div>

          <div className={styles.recentActivities}>
            <div className={styles.recentSection}>
              <h3>Recent Appointments</h3>
              <div className={styles.recentList}>
                {stats.recent_appointments.slice(0, 5).map((appointment) => (
                  <div key={appointment.id} className={styles.recentItem}>
                    <div>
                      <strong>{appointment.name}</strong>
                      <span>{appointment.service}</span>
                    </div>
                    <div>
                      <span 
                        className={styles.status}
                        style={{ backgroundColor: getStatusColor(appointment.status) }}
                      >
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.recentSection}>
              <h3>Recent Applications</h3>
              <div className={styles.recentList}>
                {stats.recent_applications.slice(0, 5).map((application) => (
                  <div key={application.id} className={styles.recentItem}>
                    <div>
                      <strong>{application.first_name} {application.last_name}</strong>
                      <span>{application.position}</span>
                    </div>
                    <div>
                      <span 
                        className={styles.status}
                        style={{ backgroundColor: getStatusColor(application.status) }}
                      >
                        {application.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <div className={styles.appointments}>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Service</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>
                      <div>
                        <strong>{appointment.name}</strong>
                        <div className={styles.email}>{appointment.email}</div>
                      </div>
                    </td>
                    <td>{appointment.service}</td>
                    <td>
                      {appointment.preferred_date} at {appointment.preferred_time}
                    </td>
                    <td>
                      <span 
                        className={styles.status}
                        style={{ backgroundColor: getStatusColor(appointment.status) }}
                      >
                        {appointment.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedAppointment(appointment)}
                        className={styles.actionButton}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Job Applications Tab */}
      {activeTab === 'applications' && (
        <div className={styles.applications}>
          <div className={styles.applicationsHeader}>
            <h3>Job Applications</h3>
            <button onClick={bulkParseCVs} className={styles.actionButton}>
              Parse All CVs
            </button>
          </div>
          
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Experience</th>
                  <th>CV Parsed</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td>
                      <div>
                        <strong>{application.first_name} {application.last_name}</strong>
                        <div className={styles.email}>{application.email}</div>
                      </div>
                    </td>
                    <td>{application.position}</td>
                    <td>{application.experience}</td>
                    <td>
                      <span className={`${styles.parseStatus} ${application.cv_parse_success ? styles.success : styles.failed}`}>
                        {application.cv_parse_success ? '✓ Parsed' : '✗ Not Parsed'}
                      </span>
                    </td>
                    <td>
                      <span 
                        className={styles.status}
                        style={{ backgroundColor: getStatusColor(application.status) }}
                      >
                        {application.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          onClick={() => setSelectedApplication(application)}
                          className={styles.actionButton}
                        >
                          View
                        </button>
                        {!application.cv_parse_success && application.cv && (
                          <button
                            onClick={() => parseCV(application.id)}
                            className={styles.parseButton}
                          >
                            Parse CV
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CV Scanner Tab */}
      {activeTab === 'cv-scan' && (
        <div className={styles.cvScan}>
          <div className={styles.scanSection}>
            <h3>CV Directory Scanner</h3>
            <p>Scan a directory for PDF files and automatically create job applications from parsed CV data.</p>
            
            <div className={styles.scanControls}>
              <div className={styles.formGroup}>
                <label>Directory Path:</label>
                <input
                  type="text"
                  value={cvScanDirectory}
                  onChange={(e) => setCvScanDirectory(e.target.value)}
                  placeholder="/path/to/cv/directory"
                />
              </div>
              <button onClick={scanCVDirectory} className={styles.scanButton}>
                Scan Directory
              </button>
            </div>

            {cvScanResults && (
              <div className={styles.scanResults}>
                <h4>Scan Results</h4>
                <div className={styles.resultsSummary}>
                  <div className={styles.resultStat}>
                    <strong>Files Processed:</strong> {cvScanResults.data?.processed_files || 0}
                  </div>
                  <div className={styles.resultStat}>
                    <strong>Applications Created/Updated:</strong> {cvScanResults.data?.created_applications || 0}
                  </div>
                  <div className={styles.resultStat}>
                    <strong>Errors:</strong> {cvScanResults.data?.errors?.length || 0}
                  </div>
                </div>

                {cvScanResults.data?.errors && cvScanResults.data.errors.length > 0 && (
                  <div className={styles.errors}>
                    <h5>Errors:</h5>
                    {cvScanResults.data.errors.map((error, index: number) => (
                      <div key={index} className={styles.error}>
                        <strong>{error.filename}:</strong> {error.error}
                      </div>
                    ))}
                  </div>
                )}

                <div className={styles.message}>
                  {cvScanResults.message}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Appointment Details</h3>
              <button onClick={() => setSelectedAppointment(null)} className={styles.closeButton}>×</button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.detailGrid}>
                <div><strong>Name:</strong> {selectedAppointment.name}</div>
                <div><strong>Email:</strong> {selectedAppointment.email}</div>
                <div><strong>Phone:</strong> {selectedAppointment.phone}</div>
                <div><strong>Company:</strong> {selectedAppointment.company}</div>
                <div><strong>Service:</strong> {selectedAppointment.service}</div>
                <div><strong>Date:</strong> {selectedAppointment.preferred_date}</div>
                <div><strong>Time:</strong> {selectedAppointment.preferred_time}</div>
                <div><strong>Status:</strong> {selectedAppointment.status}</div>
              </div>
              
              {selectedAppointment.message && (
                <div className={styles.message}>
                  <strong>Message:</strong>
                  <p>{selectedAppointment.message}</p>
                </div>
              )}

              <div className={styles.statusActions}>
                <h4>Update Status</h4>
                <div className={styles.statusButtons}>
                  <button onClick={() => updateAppointmentStatus(selectedAppointment.id, 'confirmed')} className={styles.confirmButton}>
                    Confirm
                  </button>
                  <button onClick={() => updateAppointmentStatus(selectedAppointment.id, 'completed')} className={styles.completeButton}>
                    Complete
                  </button>
                  <button onClick={() => updateAppointmentStatus(selectedAppointment.id, 'cancelled')} className={styles.cancelButton}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Application Details</h3>
              <button onClick={() => setSelectedApplication(null)} className={styles.closeButton}>×</button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.applicationTabs}>
                <div className={styles.tabSection}>
                  <h4>Basic Information</h4>
                  <div className={styles.detailGrid}>
                    <div><strong>Name:</strong> {selectedApplication.first_name} {selectedApplication.last_name}</div>
                    <div><strong>Email:</strong> {selectedApplication.email}</div>
                    <div><strong>Phone:</strong> {selectedApplication.phone}</div>
                    <div><strong>Position:</strong> {selectedApplication.position}</div>
                    <div><strong>Experience:</strong> {selectedApplication.experience}</div>
                    <div><strong>LinkedIn:</strong> {selectedApplication.linkedin}</div>
                    <div><strong>Portfolio:</strong> {selectedApplication.portfolio}</div>
                  </div>
                </div>

                {selectedApplication.cv_parse_success && (
                  <div className={styles.tabSection}>
                    <h4>Parsed CV Data</h4>
                    <div className={styles.detailGrid}>
                      <div><strong>Parsed Name:</strong> {selectedApplication.parsed_name}</div>
                      <div><strong>Parsed Email:</strong> {selectedApplication.parsed_email}</div>
                      <div><strong>Parsed Phone:</strong> {selectedApplication.parsed_phone}</div>
                      <div><strong>Experience Years:</strong> {selectedApplication.parsed_experience_years}</div>
                      <div><strong>Education:</strong> {selectedApplication.parsed_education}</div>
                    </div>
                    
                    {selectedApplication.parsed_skills && (
                      <div className={styles.skills}>
                        <strong>Skills:</strong>
                        <div className={styles.skillsList}>
                          {JSON.parse(selectedApplication.parsed_skills).map((skill: string, index: number) => (
                            <span key={index} className={styles.skill}>{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedApplication.parsed_summary && (
                      <div className={styles.summary}>
                        <strong>Summary:</strong>
                        <p>{selectedApplication.parsed_summary}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className={styles.tabSection}>
                  <h4>Cover Letter</h4>
                  <p>{selectedApplication.cover_letter}</p>
                </div>

                <div className={styles.statusActions}>
                  <h4>Update Status</h4>
                  <div className={styles.statusButtons}>
                    <button onClick={() => updateApplicationStatus(selectedApplication.id, 'reviewing')} className={styles.reviewButton}>
                      Review
                    </button>
                    <button onClick={() => updateApplicationStatus(selectedApplication.id, 'interview')} className={styles.interviewButton}>
                      Interview
                    </button>
                    <button onClick={() => updateApplicationStatus(selectedApplication.id, 'accepted')} className={styles.acceptButton}>
                      Accept
                    </button>
                    <button onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected')} className={styles.rejectButton}>
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FullAdminDashboard;
