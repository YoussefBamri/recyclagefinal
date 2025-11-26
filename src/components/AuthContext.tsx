import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [challengeContributions, setChallengeContributions] = useState<ChallengeContribution[]>([]);

  const [adminBalance, setAdminBalance] = useState<AdminBalance>({
    total: 5000,
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

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedAuth = localStorage.getItem("isAuthenticated");

    if (savedAuth === "true" && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("isAuthenticated", "true");
  };

  // 🔐 LOGOUT SÉCURISÉ
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setNotifications([]);

    // wipe storage
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
  };

  // 🔔 Notification
  const addNotification = (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: Notification = {
      ...notif,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // 🎯 Challenges
  const contributeToChallenge = (challengeId: string, amount: number) => {
    const contribution: ChallengeContribution = {
      challengeId,
      amount,
      timestamp: new Date()
    };
    setChallengeContributions(prev => [...prev, contribution]);

    addNotification({
      type: 'challenge',
      message: `Vous avez contribué ${amount} unités au défi écologique !`
    });
  };

  // 💰 Admin balance
  const addAdminTransaction = (
    transaction: Omit<AdminBalance['transactions'][0], 'id' | 'timestamp'>
  ) => {
    const newTx = {
      ...transaction,
      id: `tx${Date.now()}`,
      timestamp: new Date()
    };

    setAdminBalance(prev => {
      if (!prev) return prev;

      const newTotal = prev.total + transaction.amount;
      let newPending = prev.pendingDonations;
      let newCompleted = prev.completedDonations;

      if (transaction.type === "challenge_completion") {
        newPending += transaction.amount;
        newCompleted -= transaction.amount;
      }

      return {
        total: newTotal,
        pendingDonations: newPending,
        completedDonations: newCompleted,
        transactions: [newTx, ...prev.transactions]
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
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
