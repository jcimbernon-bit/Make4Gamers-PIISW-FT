
export type FriendshipStatus = 'pending' | 'accepted' | 'blocked';

export interface ChatProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  status: string;
  is_group?: boolean;
  room_id?: string;
  subscription_tier?: string | null;
}

export interface ChatRoom {
  id: string;
  is_group: boolean;
  created_at: string;
}


export interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  profiles?: ChatProfile; 
  is_read?: boolean;
}


export interface ChatParticipant {
  room_id: string;
  user_id: string;
  profiles?: ChatProfile; 
}


export interface Friendship {
  id: string;
  user_a: string;
  user_b: string;
  status: FriendshipStatus;
  created_at: string;
}