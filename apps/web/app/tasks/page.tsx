'use client';

import { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api';

type Task = { id: string; title: string; status: string; priority: string; stage?: { title: string } | null };

const mockTasks: Task[] = [
  { id: 'm1', title: 'Собрать бренд-платформу', status: 'IN_PROGRESS', priority: 'HIGH', stage: { title: 'Стратегия' } },
  { id: 'm2', title: 'Утвердить tone of voice', status: 'TODO', priority: 'MEDIUM', stage: { title: 'Стратегия' } },
  { id: 'm3', title: 'Проверить поставщиков ткани', status: 'BLOCKED', priority: 'CRITICAL', stage: { title: 'Производство' } }
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [apiStatus, setApiStatus] = useState<'api' | 'mock'>('mock');

  useEffect(() => {
    apiRequest<Task[]>('/tasks')
      .then((response) => {
        setTasks(response);
        setApiStatus('api');
      })
      .catch(() => setApiStatus('mock'));
  }, []);

  return (
    <div className="grid">
      <h1>Таск-менеджер</h1>
      <p className="badge">Источник: {apiStatus === 'api' ? 'реальный API' : 'мок (временный fallback)'}</p>
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
