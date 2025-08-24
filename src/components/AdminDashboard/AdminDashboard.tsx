import React, { useState, useEffect } from 'react';
import styles from './AdminDashboard.module.scss';

interface DashboardStats {
  total_customers: number;
  total_requirements: number;
  active_conversations: number;
  quotes_pending: number;
  this_week: {
    new_customers: number;
    new_requirements: number;
  };
  this_month: {
    new_customers: number;
    new_requirements: number;
  };
  status_breakdown: Array<{
    status: string;
    count: number;
  }>;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  session_id: string;
  created_at: string;
}

interface ProjectRequirement {
  id: number;
  customer: Customer;
  project_title: string;
  project_type: string;
  description: string;
  budget_range: string;
  timeline: string;
  priority: string;
  status: string;
  feasibility_score: number | null;
  estimated_days: number | null;
  estimated_cost: number | null;
  ai_evaluation: string;
  assigned_agent: string;
  agent_notes: string;
  created_at: string;
  updated_at: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [requirements, setRequirements] = useState<ProjectRequirement[]>([]);
  const [selectedRequirement, setSelectedRequirement] = useState<ProjectRequirement | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'customers'>('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const statsResponse = await fetch('http://localhost:8000/api/dashboard/stats/');
      const statsData = await statsResponse.json();
      setStats(statsData.data);

      // Fetch requirements
      const requirementsResponse = await fetch('http://localhost:8000/api/requirements/');
      const requirementsData = await requirementsResponse.json();
      setRequirements(requirementsData.data);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRequirementStatus = async (requirementId: number, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/requirements/${requirementId}/update_status/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Refresh requirements
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const assignAgent = async (requirementId: number, agentName: string, notes: string = '') => {
    try {
      const response = await fetch(`http://localhost:8000/api/requirements/${requirementId}/assign_agent/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          agent_name: agentName,
          agent_notes: notes 
        }),
      });

      if (response.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error assigning agent:', error);
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      gathering: '#ffc107',
      evaluating: '#17a2b8',
      quote_ready: '#28a745',
      quote_sent: '#007bff',
      approved: '#28a745',
      contract_sent: '#6f42c1',
      in_progress: '#fd7e14',
      completed: '#20c997',
      cancelled: '#dc3545',
    };
    return colors[status] || '#6c757d';
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      low: '#28a745',
      medium: '#ffc107',
      high: '#fd7e14',
      urgent: '#dc3545',
    };
    return colors[priority] || '#6c757d';
  };

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loading}>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>AI Customer Service Dashboard</h1>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'requirements' ? styles.active : ''}`}
            onClick={() => setActiveTab('requirements')}
          >
            Requirements
          </button>
        </div>
      </div>

      {activeTab === 'overview' && stats && (
        <div className={styles.overview}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>Total Customers</h3>
              <div className={styles.statValue}>{stats.total_customers}</div>
              <div className={styles.statSubtext}>
                +{stats.this_week.new_customers} this week
              </div>
            </div>

            <div className={styles.statCard}>
              <h3>Project Requirements</h3>
              <div className={styles.statValue}>{stats.total_requirements}</div>
              <div className={styles.statSubtext}>
                +{stats.this_week.new_requirements} this week
              </div>
            </div>

            <div className={styles.statCard}>
              <h3>Active Conversations</h3>
              <div className={styles.statValue}>{stats.active_conversations}</div>
              <div className={styles.statSubtext}>Last 7 days</div>
            </div>

            <div className={styles.statCard}>
              <h3>Quotes Pending</h3>
              <div className={styles.statValue}>{stats.quotes_pending}</div>
              <div className={styles.statSubtext}>Ready for review</div>
            </div>
          </div>

          <div className={styles.statusBreakdown}>
            <h3>Status Breakdown</h3>
            <div className={styles.statusChart}>
              {stats.status_breakdown.map((item) => (
                <div key={item.status} className={styles.statusItem}>
                  <div
                    className={styles.statusBar}
                    style={{
                      backgroundColor: getStatusColor(item.status),
                      width: `${(item.count / stats.total_requirements) * 100}%`,
                    }}
                  ></div>
                  <span className={styles.statusLabel}>
                    {item.status.replace('_', ' ').toUpperCase()}: {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'requirements' && (
        <div className={styles.requirements}>
          <div className={styles.requirementsList}>
            {requirements.map((req) => (
              <div
                key={req.id}
                className={`${styles.requirementCard} ${selectedRequirement?.id === req.id ? styles.selected : ''}`}
                onClick={() => setSelectedRequirement(req)}
              >
                <div className={styles.requirementHeader}>
                  <h4>{req.project_title || 'Untitled Project'}</h4>
                  <div className={styles.badges}>
                    <span
                      className={styles.statusBadge}
                      style={{ backgroundColor: getStatusColor(req.status) }}
                    >
                      {req.status.replace('_', ' ')}
                    </span>
                    <span
                      className={styles.priorityBadge}
                      style={{ backgroundColor: getPriorityColor(req.priority) }}
                    >
                      {req.priority}
                    </span>
                  </div>
                </div>
                
                <div className={styles.requirementMeta}>
                  <div>Customer: {req.customer.name || req.customer.email || 'Anonymous'}</div>
                  <div>Type: {req.project_type.replace('_', ' ')}</div>
                  <div>Created: {formatDate(req.created_at)}</div>
                </div>
                
                {req.estimated_cost && (
                  <div className={styles.estimate}>
                    Estimated: {formatCurrency(req.estimated_cost)} | {req.estimated_days} days
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedRequirement && (
            <div className={styles.requirementDetail}>
              <h3>Requirement Details</h3>
              
              <div className={styles.detailSection}>
                <h4>Project Information</h4>
                <div className={styles.detailGrid}>
                  <div>
                    <label>Title:</label>
                    <span>{selectedRequirement.project_title || 'N/A'}</span>
                  </div>
                  <div>
                    <label>Type:</label>
                    <span>{selectedRequirement.project_type.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <label>Budget Range:</label>
                    <span>{selectedRequirement.budget_range || 'N/A'}</span>
                  </div>
                  <div>
                    <label>Timeline:</label>
                    <span>{selectedRequirement.timeline || 'N/A'}</span>
                  </div>
                </div>
                
                <div className={styles.description}>
                  <label>Description:</label>
                  <p>{selectedRequirement.description}</p>
                </div>
              </div>

              <div className={styles.detailSection}>
                <h4>Customer Information</h4>
                <div className={styles.detailGrid}>
                  <div>
                    <label>Name:</label>
                    <span>{selectedRequirement.customer.name || 'N/A'}</span>
                  </div>
                  <div>
                    <label>Email:</label>
                    <span>{selectedRequirement.customer.email || 'N/A'}</span>
                  </div>
                  <div>
                    <label>Phone:</label>
                    <span>{selectedRequirement.customer.phone || 'N/A'}</span>
                  </div>
                  <div>
                    <label>Company:</label>
                    <span>{selectedRequirement.customer.company || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {selectedRequirement.ai_evaluation && (
                <div className={styles.detailSection}>
                  <h4>AI Evaluation</h4>
                  <div className={styles.evaluation}>
                    <div className={styles.evaluationMeta}>
                      <span>Feasibility: {selectedRequirement.feasibility_score}/10</span>
                      <span>Estimated Days: {selectedRequirement.estimated_days}</span>
                      <span>Estimated Cost: {formatCurrency(selectedRequirement.estimated_cost)}</span>
                    </div>
                    <p>{selectedRequirement.ai_evaluation}</p>
                  </div>
                </div>
              )}

              <div className={styles.actions}>
                <h4>Actions</h4>
                <div className={styles.actionButtons}>
                  <select
                    value={selectedRequirement.status}
                    onChange={(e) => updateRequirementStatus(selectedRequirement.id, e.target.value)}
                    className={styles.statusSelect}
                  >
                    <option value="gathering">Gathering Requirements</option>
                    <option value="evaluating">Evaluating Feasibility</option>
                    <option value="quote_ready">Quote Ready</option>
                    <option value="quote_sent">Quote Sent</option>
                    <option value="approved">Approved</option>
                    <option value="contract_sent">Contract Sent</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  
                  <button
                    className={styles.assignButton}
                    onClick={() => {
                      const agent = prompt('Assign to agent:');
                      if (agent) {
                        assignAgent(selectedRequirement.id, agent);
                      }
                    }}
                  >
                    Assign Agent
                  </button>
                </div>
                
                {selectedRequirement.assigned_agent && (
                  <div className={styles.agentInfo}>
                    <strong>Assigned to:</strong> {selectedRequirement.assigned_agent}
                    {selectedRequirement.agent_notes && (
                      <div><strong>Notes:</strong> {selectedRequirement.agent_notes}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
