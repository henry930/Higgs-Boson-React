import React, { useState, useEffect } from 'react';
import { 
  Dashboard, 
  ExitToApp, 
  Visibility, 
  Business, 
  Email, 
  Phone, 
  AccessTime,
  Message,
  Refresh
} from '@mui/icons-material';
import { adminApi } from '../services/adminApi';

interface ConversationSummary {
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

interface ConversationDetails {
  session_id: string;
  status: string;
  created_at: string;
  company_name?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  messages: Array<{
    speaker: string;
    message: string;
    timestamp: string;
  }>;
}

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ token, onLogout }) => {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState('');

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminApi.getConversations(token);
      setConversations(response.conversations);
    } catch (err: any) {
      setError(err.message || 'Failed to load conversations');
      if (err.message.includes('Authentication')) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const loadConversationDetails = async (conversationId: string) => {
    try {
      setDetailsLoading(true);
      const details = await adminApi.getConversationDetails(token, conversationId);
      setSelectedConversation(details);
    } catch (err: any) {
      setError(err.message || 'Failed to load conversation details');
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Dashboard className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadConversations}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                disabled={loading}
              >
                <Refresh className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                <ExitToApp className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Conversations List */}
          <div className="lg:w-1/2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Customer Conversations ({conversations.length})
                </h2>
              </div>
              
              {loading ? (
                <div className="p-6 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <p className="mt-2 text-gray-600">Loading conversations...</p>
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No conversations found
                </div>
              ) : (
                <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedConversation?.session_id === conversation.session_id 
                          ? 'bg-indigo-50 border-l-4 border-indigo-600' 
                          : ''
                      }`}
                      onClick={() => loadConversationDetails(conversation.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center mb-2">
                            <Business className="h-4 w-4 text-gray-400 mr-2" />
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {conversation.company_name || 'Unknown Company'}
                            </p>
                          </div>
                          
                          {conversation.contact_name && (
                            <p className="text-sm text-gray-600 mb-1">
                              Contact: {conversation.contact_name}
                            </p>
                          )}
                          
                          {conversation.contact_email && (
                            <div className="flex items-center mb-1">
                              <Email className="h-3 w-3 text-gray-400 mr-1" />
                              <p className="text-xs text-gray-500 truncate">
                                {conversation.contact_email}
                              </p>
                            </div>
                          )}
                          
                          {conversation.contact_phone && (
                            <div className="flex items-center mb-1">
                              <Phone className="h-3 w-3 text-gray-400 mr-1" />
                              <p className="text-xs text-gray-500">
                                {conversation.contact_phone}
                              </p>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center">
                              <Message className="h-3 w-3 text-gray-400 mr-1" />
                              <span className="text-xs text-gray-500">
                                {conversation.message_count} messages
                              </span>
                            </div>
                            <div className="flex items-center">
                              <AccessTime className="h-3 w-3 text-gray-400 mr-1" />
                              <span className="text-xs text-gray-500">
                                {formatDate(conversation.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-2">
                          <Visibility className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Conversation Details */}
          <div className="lg:w-1/2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Conversation Details
                </h2>
              </div>
              
              {!selectedConversation ? (
                <div className="p-6 text-center text-gray-500">
                  Select a conversation to view details
                </div>
              ) : detailsLoading ? (
                <div className="p-6 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <p className="mt-2 text-gray-600">Loading conversation...</p>
                </div>
              ) : (
                <div>
                  {/* Customer Info Header */}
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {selectedConversation.company_name || 'Unknown Company'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      {selectedConversation.contact_name && (
                        <p><strong>Contact:</strong> {selectedConversation.contact_name}</p>
                      )}
                      {selectedConversation.contact_email && (
                        <p><strong>Email:</strong> {selectedConversation.contact_email}</p>
                      )}
                      {selectedConversation.contact_phone && (
                        <p><strong>Phone:</strong> {selectedConversation.contact_phone}</p>
                      )}
                      <p><strong>Started:</strong> {formatDate(selectedConversation.created_at)}</p>
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <div className="p-6 max-h-96 overflow-y-auto">
                    <div className="space-y-4">
                      {selectedConversation.messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.speaker === 'customer' ? 'justify-start' : 'justify-end'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.speaker === 'customer'
                                ? 'bg-gray-200 text-gray-900'
                                : 'bg-indigo-600 text-white'
                            }`}
                          >
                            <div className="text-xs opacity-75 mb-1">
                              {message.speaker === 'customer' ? 'Customer' : 'AI Assistant'} • {formatDate(message.timestamp)}
                            </div>
                            <div className="text-sm whitespace-pre-wrap">{message.message}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
