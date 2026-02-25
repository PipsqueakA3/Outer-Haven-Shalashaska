'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL, LoginResponse, getToken, setToken } from '../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@outerhaven.local');
  const [password, setPassword] = useState('Admin123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const hint = useMemo(() => 'Тестовый админ: admin@outerhaven.local / Admin123!', []);
  useEffect(() => {
    if (getToken()) router.replace('/dashboard');
  }, [router]);


  useEffect(() => {
    if (getToken()) router.replace('/dashboard');
  }, [router]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Ошибка входа');
      }

      const data = (await res.json()) as LoginResponse;
      setToken(data.accessToken);
      localStorage.setItem('outerhaven_user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError('Не удалось выполнить вход. Проверьте email/пароль и доступность API.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card" style={{ maxWidth: 420, margin: '40px auto' }}>
      <h1>Вход в систему</h1>
      <p style={{ marginTop: 0 }}>{hint}</p>
      <form onSubmit={onSubmit} className="grid" style={{ gap: 10 }}>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #ddd' }} />
        </label>
        <label>
          Пароль
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #ddd' }} />
        </label>
        <button type="submit" className="badge" style={{ border: 0, cursor: 'pointer', padding: '10px 14px' }} disabled={loading}>
          {loading ? 'Входим...' : 'Войти'}
        </button>
      </form>
      {error && <p style={{ color: '#b42318' }}>{error}</p>}
    </section>
  );
}
