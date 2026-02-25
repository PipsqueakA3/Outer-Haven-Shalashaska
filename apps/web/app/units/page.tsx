'use client';

import { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api';

type Unit = { id: string; name: string; avatarColor: string; strength: number; speed: number; agility: number; stamina: number; loyalty: number; focus: number };
const labels = ['Сила','Скорость','Ловкость','Выносливость','Лояльность','Усидчивость'];

const mockUnits: Unit[] = [
  { id: 'm1', name: 'Михаил', avatarColor: '#5B6CFF', strength: 8, speed: 7, agility: 6, stamina: 9, loyalty: 10, focus: 9 },
  { id: 'm2', name: 'Леван', avatarColor: '#00A896', strength: 7, speed: 9, agility: 8, stamina: 7, loyalty: 8, focus: 8 }
];

export default function UnitsPage() {
  const [units, setUnits] = useState<Unit[]>(mockUnits);
  const [apiStatus, setApiStatus] = useState<'api' | 'mock'>('mock');

  useEffect(() => {
    apiRequest<Unit[]>('/units')
      .then((response) => {
        setUnits(response);
        setApiStatus('api');
      })
      .catch(() => setApiStatus('mock'));
  }, []);

  return <div className="grid"><h1>Карточки юнитов</h1><p className="badge">Источник: {apiStatus === 'api' ? 'реальный API' : 'мок (временный fallback)'}</p><div className="grid grid-3">{units.map((u)=><section key={u.id} className="card"><div style={{display:'flex', alignItems:'center', gap:10}}><div style={{width:44, height:44, borderRadius:'50%', background:u.avatarColor}}/><h3>{u.name}</h3></div>{[u.strength,u.speed,u.agility,u.stamina,u.loyalty,u.focus].map((s,i)=><div key={labels[i]} style={{display:'flex', justifyContent:'space-between'}}><span>{labels[i]}</span><strong>{s}/10</strong></div>)}</section>)}</div></div>;
}
