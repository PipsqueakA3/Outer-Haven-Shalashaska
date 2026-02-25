'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../../lib/api';

type KnowledgeItem = { id: string; title: string; type: string; tags: string[] };

const mockLinks: KnowledgeItem[] = [
  { id: 'm1', title: 'Мудборд коллекции AW26', type: 'OTHER', tags: ['мудборд', 'референсы'] },
  { id: 'm2', title: 'Финмодель запуска', type: 'GOOGLE_SHEET', tags: ['финансы', 'план'] }
];

export default function KnowledgePage() {
  const [query, setQuery] = useState('');
  const [links, setLinks] = useState<KnowledgeItem[]>(mockLinks);
  const [apiStatus, setApiStatus] = useState<'api' | 'mock'>('mock');

  useEffect(() => {
    apiRequest<KnowledgeItem[]>('/knowledge')
      .then((response) => {
        setLinks(response);
        setApiStatus('api');
      })
      .catch(() => setApiStatus('mock'));
  }, []);

  const filtered = useMemo(() => links.filter((item) => item.title.toLowerCase().includes(query.toLowerCase())), [links, query]);

  return <div className="grid"><h1>База знаний и ссылок</h1><p className="badge">Источник: {apiStatus === 'api' ? 'реальный API' : 'мок (временный fallback)'}</p><section className="card"><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Поиск по базе..." style={{width:'100%', padding:10, borderRadius:10, border:'1px solid #ddd'}}/>{filtered.map((l)=><article key={l.id} style={{padding:'12px 0', borderTop:'1px solid #eee'}}><strong>{l.title}</strong><p style={{margin:'6px 0 0'}}>Тип: {l.type} · Теги: {l.tags.join(', ')}</p></article>)}</section></div>;
}
