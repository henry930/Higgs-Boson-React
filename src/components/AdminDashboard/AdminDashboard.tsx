import React, { useState, useEffect } from 'react';
import { AdminLogin } from '../AdminLogin';
import { ConversationsList } from './ConversationsList';
import { ConversationDetail } from './ConversationDetail';
import { Logout, Dashboard } from '@mui/icons-material';

interface Conversation {
  id: string;
  session_id: string;
  status: string;
  created_at: string;
  company_name?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  message_count: number;
}

export const AdminDashboard: React.FC = () => {
  const [token, setToken] = useState<string>('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [view, setView] = useState<'list' | 'detail'>('list');

  useEffect(() => {
    // Check if user is already logged in
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleLogin = (newToken: string) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
    setSelectedConversation(null);
    setView('list');
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setView('detail');
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
    setView('list');
  };

  if (!token) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Dashboard className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              {view === 'detail' && (
                <button
                  onClick={handleBackToList}
                  className="ml-6 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  ← Back to Conversations
                </button>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Logout className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {view === 'list' ? (
          <ConversationsList
            token={token}
            onSelectConversation={handleSelectConversation}
          />
        ) : selectedConversation ? (
          <ConversationDetail
            token={token}
            conversation={selectedConversation}
            onBack={handleBackToList}
          />
        ) : null}
      </div>
    </div>
  );
};
