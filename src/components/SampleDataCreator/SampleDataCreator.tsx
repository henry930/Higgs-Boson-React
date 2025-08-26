import React, { useState } from 'react';

const SampleDataCreator: React.FC = () => {
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');

  const createSampleData = async () => {
    setCreating(true);
    setMessage('');

    try {
      // Create sample customers
      const customersData = [
        {
          name: "Alice Johnson",
          email: "alice@techcorp.com", 
          phone: "+1-555-0123",
          company: "TechCorp Solutions",
          session_id: "demo_session_002"
        },
        {
          name: "Bob Williams",
          email: "bob@startupinc.com",
          phone: "+1-555-0124", 
          company: "StartupInc",
          session_id: "demo_session_003"
        },
        {
          name: "Carol Davis",
          email: "carol@innovate.io",
          phone: "+1-555-0125",
          company: "Innovate.io",
          session_id: "demo_session_004"
        }
      ];

      const customers = [];
      for (const customerData of customersData) {
        const response = await fetch('http://localhost:8000/api/customers/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(customerData)
        });
        if (response.ok) {
          const customer = await response.json();
          customers.push(customer);
        }
      }

      // Create sample projects
      const projectsData = [
        {
          customer: customers[0]?.id,
          project_title: "E-commerce Platform Development",
          project_type: "Web Application",
          description: "Building a modern e-commerce platform with React and Django",
          budget_range: "$10,000 - $25,000",
          timeline: "3-4 months",
          priority: "High",
          status: "In Progress"
        },
        {
          customer: customers[1]?.id,
          project_title: "Mobile App for Food Delivery",
          project_type: "Mobile Application", 
          description: "iOS and Android app for food delivery service",
          budget_range: "$15,000 - $30,000",
          timeline: "4-6 months",
          priority: "Medium",
          status: "Quote Ready"
        },
        {
          customer: customers[2]?.id,
          project_title: "AI Chatbot Integration",
          project_type: "AI Solution",
          description: "Implementing AI chatbot for customer service",
          budget_range: "$5,000 - $15,000", 
          timeline: "2-3 months",
          priority: "Low",
          status: "Evaluating Feasibility"
        }
      ];

      for (const projectData of projectsData) {
        if (projectData.customer) {
          await fetch('http://localhost:8000/api/requirements/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectData)
          });
        }
      }

      // Create sample estimations
      const estimationsData = [
        {
          project_name: "E-commerce Platform",
          company_name: "TechCorp Solutions",
          company_type: "Technology",
          description: "Full-stack e-commerce development",
          tech_stack: "React, Django, PostgreSQL, AWS",
          breakdown_details: JSON.stringify({
            "Frontend Development": 120,
            "Backend API": 80,
            "Database Design": 40,
            "Payment Integration": 30,
            "Testing & QA": 50
          }),
          total_estimate: 25000,
          estimated_days: 90,
          hourly_rate: 100,
          contact_email: "alice@techcorp.com",
          contact_phone: "+1-555-0123",
          customer: customers[0]?.id,
          session_id: "demo_session_002",
          status: "sent"
        },
        {
          project_name: "Food Delivery App",
          company_name: "StartupInc", 
          company_type: "Startup",
          description: "Cross-platform mobile application",
          tech_stack: "React Native, Node.js, MongoDB",
          breakdown_details: JSON.stringify({
            "Mobile App Development": 150,
            "Backend Services": 60,
            "Payment Gateway": 25,
            "Maps Integration": 20,
            "Testing": 45
          }),
          total_estimate: 30000,
          estimated_days: 100,
          hourly_rate: 100,
          contact_email: "bob@startupinc.com",
          contact_phone: "+1-555-0124",
          customer: customers[1]?.id,
          session_id: "demo_session_003",
          status: "draft"
        }
      ];

      for (const estimationData of estimationsData) {
        if (estimationData.customer) {
          await fetch('http://localhost:8000/api/estimations/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(estimationData)
          });
        }
      }

      setMessage('✅ Sample data created successfully! Refresh the dashboard to see the changes.');
    } catch (error) {
      setMessage('❌ Error creating sample data: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
    
    setCreating(false);
  };

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '600px', 
      margin: '2rem auto',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      textAlign: 'center'
    }}>
      <h2>Sample Data Creator</h2>
      <p>Click the button below to create sample customers, projects, and estimations for testing the dashboard.</p>
      
      <button 
        onClick={createSampleData}
        disabled={creating}
        style={{
          padding: '1rem 2rem',
          background: creating ? '#ccc' : '#4ade80',
          color: creating ? '#666' : 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: creating ? 'not-allowed' : 'pointer',
          fontSize: '1.1rem',
          fontWeight: '600',
          marginBottom: '1rem'
        }}
      >
        {creating ? 'Creating Sample Data...' : 'Create Sample Data'}
      </button>
      
      {message && (
        <div style={{
          padding: '1rem',
          background: message.includes('✅') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          border: `1px solid ${message.includes('✅') ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          borderRadius: '8px',
          marginTop: '1rem'
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default SampleDataCreator;
