const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const text = await res.text();
  let data: any;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const err: any = new Error((data && data.message) || res.statusText || 'Erreur API');
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export interface Message {
  id: number;
  sender: {
    id: number;
    name: string;
    email: string;
  };
  receiver: {
    id: number;
    name: string;
    email: string;
  };
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  userId: number;
  userName: string;
  userEmail: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

// Créer un nouveau message
export async function sendMessage(senderId: number, receiverId: number, content: string): Promise<Message> {
  return request('/messages', {
    method: 'POST',
    body: JSON.stringify({ senderId, receiverId, content }),
  });
}

// Récupérer la conversation entre deux utilisateurs
export async function getConversation(userId1: number, userId2: number): Promise<Message[]> {
  return request(`/messages/conversation/${userId1}/${userId2}`);
}

// Récupérer toutes les conversations pour l'admin
export async function getConversationsForAdmin(adminId: number): Promise<Conversation[]> {
  return request(`/messages/admin/${adminId}`);
}

// Récupérer la conversation d'un utilisateur avec l'admin
export async function getConversationWithAdmin(userId: number, adminId: number): Promise<Message[]> {
  return request(`/messages/user/${userId}/admin/${adminId}`);
}

// Marquer une conversation comme lue
export async function markConversationAsRead(userId: number, adminId: number): Promise<void> {
  return request(`/messages/read/${userId}/${adminId}`, { method: 'PATCH' });
}

// Obtenir l'admin par email
export async function getAdminByEmail(email: string = 'admin@recycle.com'): Promise<any> {
  // On va chercher dans la liste des utilisateurs
  // Pour l'instant, on retourne un objet avec l'email, l'ID sera récupéré côté backend
  return { email, role: 'admin' };
}





