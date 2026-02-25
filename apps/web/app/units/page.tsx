'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { useRequireAuth } from '../../lib/useRequireAuth';

type Unit = { id: string; name: string; avatarColor: string; strength: number; speed: number; agility: number; stamina: number; loyalty: number; focus: number };

const labels: Array<[keyof Unit, string]> = [
  ['strength', 'Сила'],
  ['speed', 'Скорость'],
  ['agility', 'Ловкость'],
  ['stamina', 'Выносливость'],
  ['loyalty', 'Лояльность'],
  ['focus', 'Усидчивость']
];

export default function UnitsPage() {
  const ready = useRequireAuth();
  const [units, setUnits] = useState<Unit[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready) return;
    apiFetch<Unit[]>('/units').then(setUnits).catch(() => setError('Не удалось загрузить карточки юнитов из API.'));
  }, [ready]);

  if (!ready) return <p>Проверка авторизации...</p>;

  return <div className="grid"><h1>Карточки юнитов</h1><p className="badge" style={{ width: 'fit-content' }}>Источник данных: реальный API</p>{error && <p style={{ color: '#b42318' }}>{error}</p>}<div className="grid grid-3">{units.map((u)=><section key={u.id} className="card"><div style={{display:'flex', alignItems:'center', gap:10}}><div style={{width:44, height:44, borderRadius:'50%', background:u.avatarColor}}/><h3>{u.name}</h3></div>{labels.map(([key, label])=><div key={String(key)} style={{display:'flex', justifyContent:'space-between'}}><span>{label}</span><strong>{u[key]}/10</strong></div>)}</section>)}</div></div>;
}
