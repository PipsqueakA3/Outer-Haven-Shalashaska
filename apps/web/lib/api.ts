import { clearSession, getToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = typeof window === 'undefined' ? null : getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init?.headers || {})
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    cache: 'no-store'
  });

  if (response.status === 401 && typeof window !== 'undefined') {
    clearSession();
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Ошибка запроса к API');
  }

  return response.json();
}

export { API_URL };
