'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

  return (
    <div className="header">
      <div className="container nav">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {items.map(([name, href]) => (
            <Link key={href} href={href} className="badge" style={{ background: pathname === href ? '#dbeafe' : '#f2f4f7' }}>
              {name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
