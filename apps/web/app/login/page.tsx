'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <section className="card" style={{ maxWidth: 560, margin: '40px auto' }}>
      <h1>Вход отключён</h1>
      <p>Сайт работает в локальном режиме без логина и пароля.</p>
      <p>Перенаправляем на дашборд…</p>
    </section>
  );
}
