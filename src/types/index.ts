// Types centralisés pour l'application

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  joinedDate: string;
}

export interface Seller {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  reviewsCount: number;
  joinedDate: string;
  responseTime: string;
  verified: boolean;
}

export interface Article {
  id: number;
  title: string;
  description: string;
  fullDescription?: string;
  price: string;
  location: string;
  type: 'revendre' | 'echanger' | 'donner' | 'recycler';
  category: 'electronique' | 'meubles' | 'vetements' | 'sport' | 'livres' | 'autres';
  timeAgo: string;
  image: string;
  images?: string[];
  seller: Seller;
  condition?: string;
  dimensions?: string;
  weight?: string;
  brand?: string;
  model?: string;
  year?: string;
  status?: 'available' | 'sold' | 'reserved';
  createdAt?: string;
  updatedAt?: string;
}

export interface Comment {
  id: number;
  articleId: number;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  timeAgo: string;
}

export interface Message {
  id: number;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: number;
  otherUser: {
    id: string;
    name: string;
    avatar?: string;
  };
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  articleTitle: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  path?: string;
}

export interface Notification {
  id: number;
  type: 'comment' | 'message' | 'sold' | 'admin' | 'challenge';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  articleId?: number;
  link?: string;
}

export interface UserContribution {
  userId: string;
  userName: string;
  userAvatar?: string;
  amount: number;
  timestamp: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  sponsor: string;
  targetAmount: number;
  currentAmount: number;
  unit: string;
  reward: number;
  cause: string;
  deadline: string;
  status: 'active' | 'completed' | 'expired';
  createdAt: string;
  contributions: UserContribution[];
  completedAt?: string;
}
