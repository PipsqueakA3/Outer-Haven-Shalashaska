const stages = [
  { name: 'Стратегия', progress: 45 },
  { name: 'Производство', progress: 30 },
  { name: 'Маркетинг', progress: 20 }
];

export default function DashboardPage() {
  return (
    <div className="grid" style={{ gap: 20 }}>
      <h1>Outer Haven — внутренний центр управления</h1>
      <div className="grid grid-3">
        <section className="card"><h3>Общий прогресс</h3><p style={{ fontSize: 30, margin: 0 }}>32%</p></section>
        <section className="card"><h3>Задачи со сроком скоро</h3><p>5 задач</p></section>
        <section className="card"><h3>Быстрый доступ</h3><p>Roadmap / База знаний / Канбан</p></section>
      </div>
      <div className="grid grid-2">
        <section className="card">
          <h3>Этапы запуска бренда</h3>
          {stages.map((s) => <div key={s.name} style={{ marginBottom: 10 }}><div style={{ display:'flex', justifyContent:'space-between' }}><span>{s.name}</span><span>{s.progress}%</span></div><div style={{ height: 8, background:'#eaecf0', borderRadius:999 }}><div style={{ width:`${s.progress}%`, height:8, background:'#7f56d9', borderRadius:999 }}/></div></div>)}
        </section>
        <section className="card">
          <h3>Пирамида запуска (гибрид)</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            <div style={{ background:'#111827', color:'#fff', padding:8, borderRadius:8 }}>Уровень 3: Рост и продажи — 20%</div>
            <div style={{ background:'#1f2937', color:'#fff', padding:8, borderRadius:8 }}>Уровень 2: Операционка и производство — 33%</div>
            <div style={{ background:'#374151', color:'#fff', padding:8, borderRadius:8 }}>Уровень 1: Фундамент бренда — 55%</div>
          </div>
        </section>
      </div>
    </div>
  );
}
