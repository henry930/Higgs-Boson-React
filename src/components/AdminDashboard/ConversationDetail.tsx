import React, { useState, useEffect } from 'react';
import { Person, SmartToy, AccessTime, Email, Phone, Business } from '@mui/icons-material';
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

interface ConversationDetailProps {
  token: string;
  conversation: Conversation;
  onBack: () => void;
}

export const ConversationDetail: React.FC<ConversationDetailProps> = ({
  token,
  conversation,
  onBack,
}) => {
  const [details, setDetails] = useState<ConversationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await adminApi.getConversationDetails(token, conversation.id);
        setDetails(response);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch conversation details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [token, conversation.id]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getSpeakerIcon = (speaker: string) => {
    switch (speaker) {
      case 'customer':
        return <Person className="h-5 w-5 text-blue-600" />;
      case 'ai':
      case 'assistant':
        return <SmartToy className="h-5 w-5 text-green-600" />;
      default:
        return <Person className="h-5 w-5 text-gray-600" />;
    }
  };

  const getSpeakerName = (speaker: string) => {
    switch (speaker) {
      case 'customer':
        return details?.contact_name || 'Customer';
      case 'ai':
      case 'assistant':
        return 'AI Assistant (Sarah)';
      default:
        return speaker;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">Loading conversation details...</span>
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

  if (!details) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No conversation details found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Customer Information Card */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Customer Information
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {details.contact_name && (
              <div className="flex items-center">
                <Person className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-900">{details.contact_name}</span>
              </div>
            )}
            {details.company_name && (
              <div className="flex items-center">
                <Business className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-900">{details.company_name}</span>
              </div>
            )}
            {details.contact_email && (
              <div className="flex items-center">
                <Email className="h-5 w-5 text-gray-400 mr-2" />
                <a 
                  href={`mailto:${details.contact_email}`}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  {details.contact_email}
                </a>
              </div>
            )}
            {details.contact_phone && (
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <a 
                  href={`tel:${details.contact_phone}`}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  {details.contact_phone}
                </a>
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <AccessTime className="h-4 w-4 mr-1" />
              Started: {formatTime(details.created_at)}
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              details.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {details.status}
            </span>
          </div>
        </div>
      </div>

      {/* Conversation Messages */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Conversation ({details.messages.length} messages)
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {details.messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 ${
                  message.speaker === 'customer' ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div className="flex-shrink-0">
                  {getSpeakerIcon(message.speaker)}
                </div>
                <div className={`flex-1 ${message.speaker === 'customer' ? 'text-left' : 'text-right'}`}>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900">
                      {getSpeakerName(message.speaker)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                  <div className={`mt-1 p-3 rounded-lg ${
                    message.speaker === 'customer' 
                      ? 'bg-blue-50 text-blue-900' 
                      : 'bg-green-50 text-green-900'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
