'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { useRequireAuth } from '../../lib/useRequireAuth';

type Task = { id: string; title: string; status: string; priority: string; stage?: { title: string } | null };

export default function TasksPage() {
  const ready = useRequireAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready) return;
    apiFetch<Task[]>('/tasks').then(setTasks).catch(() => setError('Не удалось загрузить задачи из API.'));
  }, [ready]);

  if (!ready) return <p>Проверка авторизации...</p>;

  return (
    <div className="grid">
      <h1>Таск-менеджер</h1>
      <p className="badge" style={{ width: 'fit-content' }}>Источник данных: реальный API</p>
      {error && <p style={{ color: '#b42318' }}>{error}</p>}
      <section className="card">
        <p>Представления: список / kanban / по этапам (MVP)</p>
        {tasks.map((t) => (
          <article key={t.id} style={{ borderTop: '1px solid #eee', padding: '10px 0' }}>
            <strong>{t.title}</strong>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <span className="badge">{t.status}</span>
              <span className="badge">{t.priority}</span>
              <span className="badge">{t.stage?.title || 'Без этапа'}</span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
