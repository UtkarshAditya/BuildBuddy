export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  bio: string;
  location: string;
  skills: string[];
  experience: string;
  availability: 'available' | 'looking' | 'busy';
  role: string;
  github_url: string;
  linkedin_url: string;
  portfolio_url: string;
  profile_picture?: string;
}

export interface Team {
  id: number;
  name: string;
  description: string;
  category: string;
  hackathon_name: string;
  lead_name: string;
  required_skills: string[];
  open_positions: number;
  member_count: number;
  created_at: string;
  members?: TeamMember[];
  hackathon?: string;
  role?: string;
}

export interface TeamDetail extends Team {
  members: TeamMember[];
}

export interface TeamMember {
  id: number;
  username: string;
  full_name: string;
  role: string;
  status: string;
  skills?: string;
}

export interface Hackathon {
  id: number;
  name: string;
  description: string;
  category: string;
  mode: 'in-person' | 'remote' | 'hybrid';
  status: string;
  start_date: string;
  end_date: string;
  location: string;
  prize: string;
  max_participants: number;
  participant_count: number;
  website_url: string;
  registration_url: string;
}

export interface Message {
  id: number;
  sender_id: number;
  sender_name: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  id: number;
  participants: number[];
  participant_names: string[];
  last_message?: string;
  unread_count: number;
  updated_at: string;
}

export interface ConversationDetail extends Conversation {
  messages: Message[];
}

export interface TeamInvite {
  id: number;
  team_name: string;
  inviter_name: string;
  time_ago: string;
  role: string;
  message: string;
  status?: string;
  viewed?: boolean;
}

export interface JoinRequest {
  id: number;
  team_name: string;
  time_ago: string;
  status: 'pending' | 'accepted' | 'rejected';
  message: string;
}
