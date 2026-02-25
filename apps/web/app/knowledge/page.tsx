'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { useRequireAuth } from '../../lib/useRequireAuth';

type KnowledgeItem = { id: string; title: string; type: string; tags: string[] };

export default function KnowledgePage() {
  const ready = useRequireAuth();
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready) return;
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    apiFetch<KnowledgeItem[]>(`/knowledge${query}`).then(setItems).catch(() => setError('Не удалось загрузить базу знаний из API.'));
  }, [ready, search]);

  if (!ready) return <p>Проверка авторизации...</p>;

  return (
    <div className="grid">
      <h1>База знаний и ссылок</h1>
      <p className="badge" style={{ width: 'fit-content' }}>Источник данных: реальный API</p>
      {error && <p style={{ color: '#b42318' }}>{error}</p>}
      <section className="card">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск по базе..." style={{ width:'100%', padding:10, borderRadius:10, border:'1px solid #ddd' }} />
        {items.map((l) => <article key={l.id} style={{padding:'12px 0', borderTop:'1px solid #eee'}}><strong>{l.title}</strong><p style={{margin:'6px 0 0'}}>Тип: {l.type} · Теги: {l.tags.join(', ')}</p></article>)}
      </section>
    </div>
  );
}
