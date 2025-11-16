import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role?: 'user' | 'admin';
}

interface Notification {
  id: string;
  type: 'comment' | 'challenge';
  articleId?: string;
  articleTitle?: string;
  commenterName?: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface ChallengeContribution {
  challengeId: string;
  amount: number;
  timestamp: Date;
}

interface AdminBalance {
  total: number;
  pendingDonations: number;
  completedDonations: number;
  transactions: {
    id: string;
    type: 'donation' | 'challenge_completion';
    amount: number;
    description: string;
    timestamp: Date;
  }[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  notifications: Notification[];
  unreadCount: number;
  adminBalance: AdminBalance | null;
  challengeContributions: ChallengeContribution[];
  login: (userData: User) => void;
  logout: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  contributeToChallenge: (challengeId: string, amount: number) => void;
  addAdminTransaction: (transaction: Omit<AdminBalance['transactions'][0], 'id' | 'timestamp'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Aucun utilisateur connecté au démarrage
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [challengeContributions, setChallengeContributions] = useState<ChallengeContribution[]>([]);
  const [adminBalance, setAdminBalance] = useState<AdminBalance>({
    total: 5000, // Initial balance for demo
    pendingDonations: 3500,
    completedDonations: 1000,
    transactions: [
      {
        id: 'tx1',
        type: 'challenge_completion',
        amount: -1000,
        description: 'Défi "Collecte de Papier et Carton" complété - Don à Éducation Sans Frontières',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ]
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setNotifications([]);
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const contributeToChallenge = (challengeId: string, amount: number) => {
    const contribution: ChallengeContribution = {
      challengeId,
      amount,
      timestamp: new Date()
    };
    setChallengeContributions(prev => [...prev, contribution]);
    
    // Add notification for the contribution
    addNotification({
      type: 'challenge',
      message: `Vous avez contribué ${amount} unités au défi écologique !`,
    });
  };

  const addAdminTransaction = (transaction: Omit<AdminBalance['transactions'][0], 'id' | 'timestamp'>) => {
    const newTransaction = {
      ...transaction,
      id: `tx${Date.now()}`,
      timestamp: new Date()
    };
    
    setAdminBalance(prev => {
      if (!prev) return prev;
      
      const newTotal = prev.total + transaction.amount;
      let newPending = prev.pendingDonations;
      let newCompleted = prev.completedDonations;
      
      if (transaction.type === 'challenge_completion') {
        newPending += transaction.amount; // negative amount
        newCompleted -= transaction.amount; // add to completed (amount is negative)
      }
      
      return {
        total: newTotal,
        pendingDonations: newPending,
        completedDonations: newCompleted,
        transactions: [newTransaction, ...prev.transactions]
      };
    });
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      notifications, 
      unreadCount,
      adminBalance,
      challengeContributions,
      login, 
      logout, 
      addNotification,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      contributeToChallenge,
      addAdminTransaction
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}