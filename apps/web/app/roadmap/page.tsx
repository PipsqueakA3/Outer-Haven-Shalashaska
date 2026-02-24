'use client';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

const nodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Запуск бренда' }, type: 'default' },
  { id: '2', position: { x: 240, y: -90 }, data: { label: 'Этап: контент-стратегия' }, type: 'default' },
  { id: '3', position: { x: 240, y: 90 }, data: { label: 'Задача: поставщики' }, type: 'default' }
];
const edges = [{ id: 'e1-2', source: '1', target: '2' }, { id: 'e1-3', source: '1', target: '3' }];

export default function RoadmapPage() {
  return <div className="grid"><h1>Roadmap / схема</h1><section className="card" style={{height:500}}><ReactFlow nodes={nodes} edges={edges} fitView><Background /><Controls /></ReactFlow></section></div>;
}
