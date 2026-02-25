'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { clearSession, getToken } from '../lib/api';

const items = [
  ['Дашборд', '/dashboard'],
  ['Задачи', '/tasks'],
  ['Roadmap', '/roadmap'],
  ['База знаний', '/knowledge'],
  ['Юниты', '/units'],
  ['Настройки', '/settings']
];

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(Boolean(getToken()));
  }, [pathname]);

  function logout() {
    clearSession();
    setLoggedIn(false);
    router.push('/login');
  }

  return (
    <div className="header">
      <div className="container nav" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {items.map(([name, href]) => (
            <Link key={href} href={href} className="badge" style={{ background: pathname === href ? '#dbeafe' : '#f2f4f7' }}>
              {name}
            </Link>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {!loggedIn ? (
            <Link href="/login" className="badge" style={{ background: pathname === '/login' ? '#dbeafe' : '#f2f4f7' }}>
              Вход
            </Link>
          ) : (
            <button type="button" className="badge" style={{ border: 0, cursor: 'pointer' }} onClick={logout}>
              Выйти
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
