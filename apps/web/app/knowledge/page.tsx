const links = [
  { title: 'Мудборд коллекции AW26', type: 'Другое', tags: 'мудборд, референсы' },
  { title: 'Финмодель запуска', type: 'Google Sheet', tags: 'финансы, план' }
];

export default function KnowledgePage() {
  return <div className="grid"><h1>База знаний и ссылок</h1><section className="card"><input placeholder="Поиск по базе..." style={{width:'100%', padding:10, borderRadius:10, border:'1px solid #ddd'}}/>{links.map((l)=><article key={l.title} style={{padding:'12px 0', borderTop:'1px solid #eee'}}><strong>{l.title}</strong><p style={{margin:'6px 0 0'}}>Тип: {l.type} · Теги: {l.tags}</p></article>)}</section></div>;
}
