export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export type LoginResponse = {
  accessToken: string;
  user: { id: string; name: string; role: string };
};

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('outerhaven_token');
}

export function getUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('outerhaven_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LoginResponse['user'];
  } catch {
    return null;
  }
}

export function setToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('outerhaven_token', token);
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('outerhaven_token');
  localStorage.removeItem('outerhaven_user');
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const headers = new Headers(init?.headers || {});
  if (!(init?.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, { ...init, headers, cache: 'no-store' });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}
