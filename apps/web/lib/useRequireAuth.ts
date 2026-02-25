'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiFetch, clearSession, getToken } from './api';

export function useRequireAuth() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace('/login');
      return;
    }

    apiFetch<{ role: string }>('/auth/me')
      .then((user) => {
        if (user.role !== 'ADMIN') {
          clearSession();
          router.replace('/login');
          return;
        }
        setReady(true);
      })
      .catch(() => {
        clearSession();
        router.replace('/login');
      });
  }, [router]);

  return ready;
}
