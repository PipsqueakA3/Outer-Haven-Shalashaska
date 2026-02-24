const units = [
  { name: 'Михаил', c: '#5B6CFF', stats: [8,7,6,9,10,9] },
  { name: 'Леван', c: '#00A896', stats: [7,9,8,7,8,8] }
];
const labels = ['Сила','Скорость','Ловкость','Выносливость','Лояльность','Усидчивость'];

export default function UnitsPage() {
  return <div className="grid"><h1>Карточки юнитов (заглушка)</h1><div className="grid grid-3">{units.map((u)=><section key={u.name} className="card"><div style={{display:'flex', alignItems:'center', gap:10}}><div style={{width:44, height:44, borderRadius:'50%', background:u.c}}/><h3>{u.name}</h3></div>{u.stats.map((s,i)=><div key={labels[i]} style={{display:'flex', justifyContent:'space-between'}}><span>{labels[i]}</span><strong>{s}/10</strong></div>)}</section>)}</div></div>;
}
