const tasks = [
  { title: 'Собрать бренд-платформу', status: 'In Progress', priority: 'High', stage: 'Стратегия' },
  { title: 'Утвердить tone of voice', status: 'To Do', priority: 'Medium', stage: 'Стратегия' },
  { title: 'Проверить поставщиков ткани', status: 'Blocked', priority: 'Critical', stage: 'Производство' }
];

export default function TasksPage() {
  return <div className="grid"><h1>Таск-менеджер</h1><section className="card"><p>Представления: список / kanban / по этапам (MVP)</p>{tasks.map((t)=><article key={t.title} style={{borderTop:'1px solid #eee', padding:'10px 0'}}><strong>{t.title}</strong><div style={{display:'flex', gap:8, marginTop:6}}><span className="badge">{t.status}</span><span className="badge">{t.priority}</span><span className="badge">{t.stage}</span></div></article>)}</section></div>;
}
