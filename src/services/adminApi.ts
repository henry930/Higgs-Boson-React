const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://fqsgv6rshb.execute-api.us-east-1.amazonaws.com/prod';

interface LoginResponse {
  token: string;
  username: string;
}

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

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const adminApi = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    });
    return handleResponse(response);
  },

  async getConversations(token: string): Promise<{ conversations: ConversationSummary[] }> {
    const response = await fetch(`${API_BASE_URL}/api/admin/conversations`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  async getConversationDetails(token: string, conversationId: string): Promise<ConversationDetails> {
    const response = await fetch(`${API_BASE_URL}/api/admin/conversation?id=${conversationId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return handleResponse(response);
  }
};
