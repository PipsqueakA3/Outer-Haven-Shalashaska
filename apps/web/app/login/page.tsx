'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '../../lib/api';
import { saveSession } from '../../lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@outerhaven.local');
  const [password, setPassword] = useState('Admin123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        setError('Не удалось войти. Проверьте логин и пароль.');
        return;
      }

      const data = await response.json();
      saveSession(data.accessToken, data.user);
      router.push('/dashboard');
    } catch {
      setError('Нет соединения с backend API. Проверьте запуск apps/api.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card" style={{ maxWidth: 420, margin: '40px auto' }}>
      <h1>Вход в систему</h1>
      <p>Тестовый админ: admin@outerhaven.local / Admin123!</p>
      <form className="grid" onSubmit={handleSubmit}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{ padding: 10, borderRadius: 10, border: '1px solid #ddd' }} />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Пароль" style={{ padding: 10, borderRadius: 10, border: '1px solid #ddd' }} />
        {error ? <p style={{ margin: 0, color: '#b42318' }}>{error}</p> : null}
        <button type="submit" className="badge" style={{ border: 0, cursor: 'pointer', padding: '10px 14px' }} disabled={loading}>
          {loading ? 'Входим...' : 'Войти'}
        </button>
      </form>
    </section>
  );
}
