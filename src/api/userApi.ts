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
  // Backend current controller mounts routes under /auth (Nest logs show /auth/register)
  // Align frontend to call /auth/register so requests reach the backend routes.
  return request('/users/register', { method: 'POST', body: JSON.stringify(dto) });
}

export async function loginUser(dto: LoginDto) {
  // Call the backend login route under /auth
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