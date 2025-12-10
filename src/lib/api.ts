// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Type imports
import type { User, Team, TeamDetail, Hackathon, Message } from '@/types';

// Task interface (should match backend)
export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  color?: string;
  assigned_to_id: number | null;
  assigned_to_name: string | null;
  created_by_id: number;
  created_by_name: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

// Token management
export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

export const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refresh_token');
  }
  return null;
};

export const setRefreshToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('refresh_token', token);
  }
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// API Request Helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const data = await apiRequest<{ access: string; refresh: string }>('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(data.access);
    setRefreshToken(data.refresh);
    return data;
  },

  register: async (email: string, username: string, password: string, full_name: string) => {
    const data = await apiRequest<{ id: number; email: string; username: string }>('/users/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password, full_name }),
    });
    return data;
  },

  logout: () => {
    removeAuthToken();
  },

  getCurrentUser: async () => {
    return apiRequest('/users/me');
  },
};

// Users API
export const usersAPI = {
  search: async (q = '', skills = '', availability = ''): Promise<User[]> => {
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    if (skills) params.append('skills', skills);
    if (availability) params.append('availability', availability);
    
    const query = params.toString();
    return apiRequest<User[]>(`/users/search${query ? `?${query}` : ''}`);
  },

  getById: async (id: number): Promise<User> => {
    return apiRequest<User>(`/users/${id}`);
  },

  updateProfile: async (data: Record<string, unknown>): Promise<User> => {
    return apiRequest<User>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Teams API
export const teamsAPI = {
  list: async (category = '', hackathon_id?: number) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (hackathon_id) params.append('hackathon_id', hackathon_id.toString());
    
    const query = params.toString();
    return apiRequest(`/teams/${query ? `?${query}` : ''}`);
  },

  search: async (q = '', skills = '') => {
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    if (skills) params.append('skills', skills);
    
    const query = params.toString();
    return apiRequest(`/teams/search${query ? `?${query}` : ''}`);
  },

  getById: async (id: number) => {
    return apiRequest(`/teams/${id}`);
  },

  create: async (teamData: {
    name: string;
    description: string;
    category?: string;
    hackathon?: number;
    required_skills?: string[];
    team_size?: number;
  }) => {
    return apiRequest('/teams/', {
      method: 'POST',
      body: JSON.stringify(teamData),
    });
  },

  update: async (id: number, teamData: Record<string, unknown>) => {
    return apiRequest(`/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(teamData),
    });
  },

  getMyTeams: async (): Promise<Team[]> => {
    return apiRequest<Team[]>('/teams/myteams');
  },

  inviteToTeam: async (teamId: number, userId: number) => {
    return apiRequest('/teams/invite', {
      method: 'POST',
      body: JSON.stringify({ team_id: teamId, user_id: userId }),
    });
  },

  requestToJoinTeam: async (teamId: number) => {
    return apiRequest('/teams/apply', {
      method: 'POST',
      body: JSON.stringify({ team_id: teamId }),
    });
  },

  getJoinRequests: async (teamId: number) => {
    return apiRequest(`/teams/${teamId}/requests`);
  },

  acceptRequest: async (teamId: number, userId: number) => {
    return apiRequest(`/teams/${teamId}/accept/${userId}`, {
      method: 'POST',
    });
  },

  rejectRequest: async (teamId: number, userId: number) => {
    return apiRequest(`/teams/${teamId}/reject/${userId}`, {
      method: 'POST',
    });
  },

  getMyInvites: async () => {
    return apiRequest('/teams/invites');
  },

  getMyJoinRequests: async () => {
    return apiRequest('/teams/join-requests');
  },

  markInvitesAsViewed: async () => {
    return apiRequest('/teams/invites/mark-viewed', {
      method: 'POST',
    });
  },

  acceptInvite: async (inviteId: number) => {
    return apiRequest(`/teams/accept-invite/${inviteId}`, {
      method: 'POST',
    });
  },

  rejectInvite: async (inviteId: number) => {
    return apiRequest(`/teams/reject-invite/${inviteId}`, {
      method: 'POST',
    });
  },

  getTeamMembers: async (teamId: number): Promise<TeamDetail> => {
    return apiRequest<TeamDetail>(`/teams/${teamId}`);
  },

  acceptMember: async (teamId: number, userId: number) => {
    return apiRequest(`/teams/${teamId}/accept/${userId}`, {
      method: 'POST',
    });
  },

  rejectMember: async (teamId: number, userId: number) => {
    return apiRequest(`/teams/${teamId}/reject/${userId}`, {
      method: 'POST',
    });
  },

  // Team Tasks
  getTasks: async (teamId: number): Promise<Task[]> => {
    return apiRequest<Task[]>(`/teams/${teamId}/tasks`);
  },

  createTask: async (teamId: number, taskData: {
    title: string;
    description?: string;
    assigned_to_id?: number;
    status?: string;
    priority?: string;
    due_date?: string;
    color?: string;
  }): Promise<Task> => {
    return apiRequest<Task>(`/teams/${teamId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  updateTask: async (teamId: number, taskId: number, taskData: {
    title?: string;
    description?: string;
    assigned_to_id?: number | null;
    status?: string;
    priority?: string;
    due_date?: string | null;
    color?: string;
  }): Promise<Task> => {
    return apiRequest<Task>(`/teams/${teamId}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  },

  deleteTask: async (teamId: number, taskId: number) => {
    return apiRequest(`/teams/${teamId}/tasks/${taskId}`, {
      method: 'DELETE',
    });
  },

  deleteTeam: async (teamId: number) => {
    return apiRequest(`/teams/${teamId}`, {
      method: 'DELETE',
    });
  },
};

// Hackathons API
export const hackathonsAPI = {
  list: async (category = '', mode = '', status = ''): Promise<Hackathon[]> => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (mode) params.append('mode', mode);
    if (status) params.append('status', status);
    
    const query = params.toString();
    return apiRequest<Hackathon[]>(`/hackathons/${query ? `?${query}` : ''}`);
  },

  search: async (q: string): Promise<Hackathon[]> => {
    return apiRequest<Hackathon[]>(`/hackathons/search?q=${encodeURIComponent(q)}`);
  },

  getById: async (id: number): Promise<Hackathon> => {
    return apiRequest<Hackathon>(`/hackathons/${id}`);
  },

  register: async (hackathonId: number) => {
    return apiRequest(`/hackathons/${hackathonId}/register`, {
      method: 'POST',
    });
  },

  getMyRegistrations: async () => {
    return apiRequest('/hackathons/my-registrations');
  },
};

// Messages API
export const messagesAPI = {
  getConversations: async () => {
    return apiRequest('/messages/conversations');
  },

  getConversation: async (conversationId: number) => {
    return apiRequest(`/messages/conversations/${conversationId}`);
  },

  getTeamConversation: async (teamId: number) => {
    return apiRequest(`/messages/team/${teamId}/conversation`);
  },

  sendMessage: async (recipientId: number, content: string): Promise<Message> => {
    return apiRequest<Message>('/messages/send', {
      method: 'POST',
      body: JSON.stringify({ recipient_id: recipientId, content }),
    });
  },

  replyToConversation: async (conversationId: number, content: string): Promise<Message> => {
    return apiRequest<Message>(`/messages/conversations/${conversationId}/send`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  getUnreadCount: async () => {
    return apiRequest('/messages/unread-count');
  },

  markAsRead: async (conversationId: number) => {
    return apiRequest(`/messages/conversations/${conversationId}/read`, {
      method: 'POST',
    });
  },
};
