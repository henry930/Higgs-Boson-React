import React, { useState, useEffect } from 'react';
import { Email, Phone, Business, AccessTime, Chat, Person } from '@mui/icons-material';
import { adminApi } from '../../services/adminApi';

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

interface ConversationsListProps {
  token: string;
  onSelectConversation: (conversation: Conversation) => void;
}

export const ConversationsList: React.FC<ConversationsListProps> = ({
  token,
  onSelectConversation,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await adminApi.getConversations(token);
        setConversations(response.conversations);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch conversations');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [token]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">Loading conversations...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex items-center">
          <div className="text-red-800">
            <strong>Error:</strong> {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Customer Conversations
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {conversations.length} total conversations
        </p>
      </div>
      
      {conversations.length === 0 ? (
        <div className="text-center py-8">
          <Chat className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No conversations</h3>
          <p className="mt-1 text-sm text-gray-500">
            No customer conversations have been recorded yet.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {conversations.map((conversation) => (
            <li key={conversation.id}>
              <button
                onClick={() => onSelectConversation(conversation)}
                className="w-full text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out"
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Person className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {conversation.contact_name || 'Anonymous'}
                          </p>
                          {conversation.company_name && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <Business className="h-3 w-3 mr-1" />
                              {conversation.company_name}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          {conversation.contact_email && (
                            <div className="flex items-center">
                              <Email className="h-4 w-4 mr-1" />
                              {conversation.contact_email}
                            </div>
                          )}
                          {conversation.contact_phone && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              {conversation.contact_phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center text-sm text-gray-500">
                        <AccessTime className="h-4 w-4 mr-1" />
                        {formatDate(conversation.created_at)}
                      </div>
                      <div className="mt-1 flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {conversation.message_count} messages
                        </span>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          conversation.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {conversation.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
