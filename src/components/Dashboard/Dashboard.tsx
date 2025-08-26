import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import SampleDataCreator from '../SampleDataCreator/SampleDataCreator';
import './Dashboard.css';

interface DashboardStats {
  total_customers: number;
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  total_estimations: number;
  pending_estimations: number;
  total_revenue: number;
  recent_conversations: number;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  created_at: string;
}

interface Project {
  id: number;
  project_title: string;
  status: string;
  customer_name?: string;
  created_at: string;
}

interface DashboardData {
  stats: DashboardStats;
  recent_projects: Project[];
  recent_customers: Customer[];
}

interface StatusDistribution {
  [key: string]: number;
}

interface TypeDistribution {
  [key: string]: number;
}

interface RevenueData {
  month: string;
  revenue: number;
}

interface AnalyticsData {
  status_distribution: StatusDistribution;
  type_distribution: TypeDistribution;
  revenue_trend: RevenueData[];
}

const Dashboard: React.FC = () => {
  const { user, token, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
      fetchAnalyticsData();
    }
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/dashboard/overview/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/dashboard/analytics/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAnalyticsData(data);
      setLoading(false);
    } catch (err) {
      console.error('Analytics data fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  // If no token but we're here, we're still loading
  if (!token) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading authentication...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h3>Error loading dashboard</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!dashboardData || !analyticsData) {
    return <div className="dashboard-error">No data available</div>;
  }

  const { stats, recent_projects, recent_customers } = dashboardData;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>Project Management Dashboard</h1>
            <p>Welcome back, {user?.firstName || user?.username}!</p>
          </div>
          <div className="user-section">
            <span className="user-info">{user?.email}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Key Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card customers">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.total_customers}</h3>
            <p>Total Customers</p>
          </div>
        </div>

        <div className="stat-card projects">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.total_projects}</h3>
            <p>Total Projects</p>
          </div>
        </div>

        <div className="stat-card active">
          <div className="stat-icon">🚀</div>
          <div className="stat-content">
            <h3>{stats.active_projects}</h3>
            <p>Active Projects</p>
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.completed_projects}</h3>
            <p>Completed Projects</p>
          </div>
        </div>

        <div className="stat-card estimations">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{stats.total_estimations}</h3>
            <p>Total Estimations</p>
          </div>
        </div>

        <div className="stat-card revenue">
          <div className="stat-icon">💎</div>
          <div className="stat-content">
            <h3>${stats.total_revenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-content">
        <div className="content-section">
          <div className="section-header">
            <h2>Recent Customers</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="customers-list">
            {recent_customers.length > 0 ? (
              recent_customers.map((customer) => (
                <div key={customer.id} className="customer-item">
                  <div className="customer-avatar">
                    {customer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="customer-info">
                    <h4>{customer.name}</h4>
                    <p>{customer.company}</p>
                    <small>{customer.email}</small>
                  </div>
                  <div className="customer-date">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No recent customers</p>
              </div>
            )}
          </div>
        </div>

        <div className="content-section">
          <div className="section-header">
            <h2>Recent Projects</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="projects-list">
            {recent_projects.length > 0 ? (
              recent_projects.map((project) => (
                <div key={project.id} className="project-item">
                  <div className="project-info">
                    <h4>{project.project_title}</h4>
                    <p>{project.customer_name}</p>
                  </div>
                  <div className="project-status">
                    <span className={`status-badge status-${project.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="project-date">
                    {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No recent projects</p>
                <button className="create-btn">+ Create Project</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sample Data Creator - for testing */}
      <SampleDataCreator />

      {/* Analytics Section */}
      <div className="analytics-section">
        <h2>Analytics Overview</h2>
        
        <div className="analytics-grid">
          <div className="analytics-card">
            <h3>Project Status Distribution</h3>
            <div className="status-chart">
              {Object.entries(analyticsData.status_distribution).map(([status, count]) => (
                <div key={status} className="status-item">
                  <span className="status-label">{status}</span>
                  <span className="status-count">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="analytics-card">
            <h3>Project Type Distribution</h3>
            <div className="type-chart">
              {Object.entries(analyticsData.type_distribution).map(([type, count]) => (
                <div key={type} className="type-item">
                  <span className="type-label">{type}</span>
                  <span className="type-count">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="analytics-card">
            <h3>Revenue Trend (Last 6 Months)</h3>
            <div className="revenue-chart">
              {analyticsData.revenue_trend.map((data) => (
                <div key={data.month} className="revenue-item">
                  <span className="month-label">{data.month}</span>
                  <span className="revenue-amount">${data.revenue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
