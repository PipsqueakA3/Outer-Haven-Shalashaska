'use client';

import { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api';

type SummaryResponse = {
  brand: { id: string; name: string; progress: number; stages: { id: string; title: string; progress: number }[]; launchLayers: { id: string; title: string; progress: number; level: number }[] } | null;
  dueTasks: { id: string; title: string; deadline: string | null }[];
};

const mockStages = [
  { id: '1', title: 'Стратегия', progress: 45 },
  { id: '2', title: 'Производство', progress: 30 },
  { id: '3', title: 'Маркетинг', progress: 20 }
];

export default function DashboardPage() {
  const [data, setData] = useState<SummaryResponse | null>(null);
  const [apiStatus, setApiStatus] = useState<'api' | 'mock'>('mock');

  useEffect(() => {
    apiRequest<SummaryResponse>('/dashboard/summary')
      .then((response) => {
        setData(response);
        setApiStatus('api');
      })
      .catch(() => setApiStatus('mock'));
  }, []);

  const stages = data?.brand?.stages?.length ? data.brand.stages : mockStages;
  const launchLayers = data?.brand?.launchLayers || [];

  return (
    <div className="grid" style={{ gap: 20 }}>
      <h1>Outer Haven — внутренний центр управления</h1>
      <p className="badge">Источник: {apiStatus === 'api' ? 'реальный API' : 'мок (нет авторизации/API)'}</p>
      <div className="grid grid-3">
        <section className="card"><h3>Общий прогресс</h3><p style={{ fontSize: 30, margin: 0 }}>{data?.brand?.progress ?? 32}%</p></section>
        <section className="card"><h3>Задачи со сроком скоро</h3><p>{data?.dueTasks?.length ?? 5} задач</p></section>
        <section className="card"><h3>Быстрый доступ</h3><p>Roadmap / База знаний / Канбан</p></section>
      </div>
      <div className="grid grid-2">
        <section className="card">
          <h3>Этапы запуска бренда</h3>
          {stages.map((s) => <div key={s.id} style={{ marginBottom: 10 }}><div style={{ display:'flex', justifyContent:'space-between' }}><span>{s.title}</span><span>{s.progress}%</span></div><div style={{ height: 8, background:'#eaecf0', borderRadius:999 }}><div style={{ width:`${s.progress}%`, height:8, background:'#7f56d9', borderRadius:999 }}/></div></div>)}
        </section>
        <section className="card">
          <h3>Пирамида запуска</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {(launchLayers.length ? launchLayers : [{ id: 'm1', title: 'Рост и продажи', progress: 20, level: 3 }, { id: 'm2', title: 'Операционка и производство', progress: 33, level: 2 }, { id: 'm3', title: 'Фундамент бренда', progress: 55, level: 1 }])
              .sort((a, b) => b.level - a.level)
              .map((layer) => <div key={layer.id} style={{ background:'#1f2937', color:'#fff', padding:8, borderRadius:8 }}>{`Уровень ${layer.level}: ${layer.title} — ${layer.progress}%`}</div>)}
          </div>
        </section>
      </div>
    </div>
  );
}
