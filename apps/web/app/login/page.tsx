'use client';

import Link from 'next/link';

export default function LoginPage() {
  return (
    <section className="card" style={{ maxWidth: 520, margin: '40px auto' }}>
      <h1>Вход отключён</h1>
      <p style={{ marginTop: 0 }}>
        Для текущего dev-режима авторизация отключена: все разделы доступны сразу с правами администратора.
      </p>
      <Link href="/dashboard" className="badge" style={{ display: 'inline-block', padding: '10px 14px', background: '#dbeafe' }}>
        Перейти в дашборд
      </Link>
    </section>
  );
}
