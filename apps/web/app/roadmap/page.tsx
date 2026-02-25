'use client';

import { useEffect, useMemo, useState } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { apiFetch } from '../../lib/api';
import { useRequireAuth } from '../../lib/useRequireAuth';

type Node = { id: string; x: number; y: number; label: string };
type Board = { id: string; title: string; nodes: Node[] };

const mockNodes = [
  { id: 'm1', position: { x: 0, y: 0 }, data: { label: 'Запуск бренда (mock)' }, type: 'default' },
  { id: 'm2', position: { x: 220, y: -90 }, data: { label: 'Этап: контент-стратегия (mock)' }, type: 'default' }
];

export default function RoadmapPage() {
  const ready = useRequireAuth();
  const [boards, setBoards] = useState<Board[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready) return;
    apiFetch<Board[]>('/roadmap').then(setBoards).catch(() => setError('API roadmap недоступен, показан mock.'));
  }, [ready]);

  const nodes = useMemo(() => {
    const board = boards[0];
    if (!board) return mockNodes;
    return board.nodes.map((n) => ({ id: n.id, position: { x: n.x, y: n.y }, data: { label: n.label }, type: 'default' }));
  }, [boards]);

  const edges = useMemo(() => nodes.slice(1).map((node, idx) => ({ id: `e-${idx}`, source: nodes[0]?.id || node.id, target: node.id })), [nodes]);

  if (!ready) return <p>Проверка авторизации...</p>;

  return <div className="grid"><h1>Roadmap / схема</h1><p className="badge" style={{ width: 'fit-content' }}>{boards.length ? 'Источник данных: реальный API' : 'Источник данных: mock fallback'}</p>{error && <p style={{ color: '#b42318' }}>{error}</p>}<section className="card" style={{height:500}}><ReactFlow nodes={nodes} edges={edges} fitView><Background /><Controls /></ReactFlow></section></div>;
}
