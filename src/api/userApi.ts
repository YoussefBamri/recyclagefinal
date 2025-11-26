export interface RegisterDto {
  name: string; 
  email: string;
  password: string;
  phone?: string;
  role?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

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

export async function registerUser(dto: RegisterDto) {
  return request('/users/register', { method: 'POST', body: JSON.stringify(dto) });
}

export async function loginUser(dto: LoginDto) {
  return request('/users/login', { method: 'POST', body: JSON.stringify(dto) });
}

export async function getRoles() {
  return request('/users/roles/available');
}

export async function verifyEmail(token: string) {
  return request(`/users/verify-email?token=${encodeURIComponent(token)}`, { method: 'GET' });
}

export async function resendVerificationEmail(email: string) {
  return request('/users/resend-verification', { 
    method: 'POST',
    body: JSON.stringify({ email }) 
  });
}

export async function getAllUsers() {
  return request('/users');
}

export async function getAdminUser() {
  const response = await getAllUsers();
  const users = response.users || [];
  const admin = users.find((u: any) => u.role === 'admin' || u.email === 'admin@recycle.com');
  return admin;
}