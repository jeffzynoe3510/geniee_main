export type ConnectionStatus = 'pending' | 'connected' | 'blocked';
export type GroupType = 'fitness' | 'nutrition' | 'mental_health' | 'general';
export type InteractionType = 'message' | 'achievement' | 'challenge' | 'support';

export interface UserConnection {
  id: string;
  userId: string;
  connectedUserId: string;
  status: ConnectionStatus;
  connectedAt: string;
  lastInteractionAt: string;
  sharedGoals: string[]; // Goal IDs
  mutualGroups: string[]; // Group IDs
}

export interface SupportGroup {
  id: string;
  name: string;
  description: string;
  type: GroupType;
  createdBy: string;
  createdAt: string;
  members: string[]; // User IDs
  moderators: string[]; // User IDs
  rules: string[];
  isPrivate: boolean;
  memberCount: number;
}

export interface GroupPost {
  id: string;
  groupId: string;
  userId: string;
  content: string;
  type: InteractionType;
  likes: number;
  comments: GroupComment[];
  attachments?: string[]; // URLs to images/files
  createdAt: string;
  updatedAt: string;
}

export interface GroupComment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface Challenge {
  id: string;
  groupId: string;
  createdBy: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  participants: string[]; // User IDs
  type: GroupType;
  rules: string[];
  rewards?: string[];
  status: 'upcoming' | 'active' | 'completed';
}

export interface SocialSupportState {
  loading: boolean;
  error: string | null;
  connections: UserConnection[];
  groups: SupportGroup[];
  posts: GroupPost[];
  challenges: Challenge[];
  selectedGroup: SupportGroup | null;
  selectedChallenge: Challenge | null;
  isCreating: boolean;
} 