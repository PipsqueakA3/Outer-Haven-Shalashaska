'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { clearSession, getUser, type SessionUser } from '../lib/auth';

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
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, [pathname]);

  return (
    <div className="header">
      <div className="container nav" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 14, overflow: 'auto' }}>
          {items.map(([name, href]) => (
            <Link key={href} href={href} className="badge" style={{ background: pathname === href ? '#dbeafe' : '#f2f4f7' }}>
              {name}
            </Link>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {user ? <span className="badge">{user.name} ({user.role})</span> : null}
          {!user ? (
            <Link href="/login" className="badge">Логин</Link>
          ) : (
            <button
              className="badge"
              style={{ border: 0, cursor: 'pointer' }}
              onClick={() => {
                clearSession();
                router.push('/login');
              }}
            >
              Выход
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
