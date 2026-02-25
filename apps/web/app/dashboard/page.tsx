'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { useRequireAuth } from '../../lib/useRequireAuth';

type Stage = { id: string; title: string; progress: number };
type Layer = { id: string; title: string; level: number; progress: number };
type DashboardSummary = {
  brand: { id: string; name: string; stages: Stage[]; launchLayers: Layer[] } | null;
  dueTasks: Array<{ id: string; title: string; deadline: string | null }>;
};

export default function DashboardPage() {
  const ready = useRequireAuth();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready) return;
    apiFetch<DashboardSummary>('/dashboard/summary').then(setData).catch(() => setError('Не удалось загрузить дашборд из API.'));
  }, [ready]);

  if (!ready) return <p>Проверка авторизации...</p>;

  const stages = data?.brand?.stages || [];
  const layers = (data?.brand?.launchLayers || []).slice().sort((a, b) => b.level - a.level);

  return (
    <div className="grid" style={{ gap: 20 }}>
      <h1>Outer Haven — внутренний центр управления</h1>
      <p className="badge" style={{ width: 'fit-content' }}>Источник данных: реальный API</p>
      {error && <p style={{ color: '#b42318' }}>{error}</p>}
      <div className="grid grid-3">
        <section className="card"><h3>Общий прогресс</h3><p style={{ fontSize: 30, margin: 0 }}>{stages.length ? Math.round(stages.reduce((acc, s) => acc + s.progress, 0) / stages.length) : 0}%</p></section>
        <section className="card"><h3>Задачи со сроком скоро</h3><p>{data?.dueTasks.length || 0} задач</p></section>
        <section className="card"><h3>Быстрый доступ</h3><p>Roadmap / База знаний / Канбан</p></section>
      </div>
      <div className="grid grid-2">
        <section className="card">
          <h3>Этапы запуска бренда</h3>
          {stages.map((s) => <div key={s.id} style={{ marginBottom: 10 }}><div style={{ display:'flex', justifyContent:'space-between' }}><span>{s.title}</span><span>{s.progress}%</span></div><div style={{ height: 8, background:'#eaecf0', borderRadius:999 }}><div style={{ width:`${s.progress}%`, height:8, background:'#7f56d9', borderRadius:999 }}/></div></div>)}
        </section>
        <section className="card">
          <h3>Пирамида запуска (гибрид)</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {layers.map((layer) => <div key={layer.id} style={{ background: `hsl(220 ${30 + layer.level * 10}% ${20 + layer.level * 10}%)`, color:'#fff', padding:8, borderRadius:8 }}>{layer.title} — {layer.progress}%</div>)}
          </div>
        </section>
      </div>
    </div>
  );
}
