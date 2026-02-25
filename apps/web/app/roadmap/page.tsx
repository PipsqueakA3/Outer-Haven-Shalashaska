'use client';

import { useEffect, useState } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { apiRequest } from '../../lib/api';

type Summary = { brand: { id: string } | null };
type Board = { id: string; nodes: { id: string; label: string; x: number; y: number }[] };

const mockNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Запуск бренда' }, type: 'default' as const },
  { id: '2', position: { x: 240, y: -90 }, data: { label: 'Этап: контент-стратегия' }, type: 'default' as const },
  { id: '3', position: { x: 240, y: 90 }, data: { label: 'Задача: поставщики' }, type: 'default' as const }
];
const mockEdges = [{ id: 'e1-2', source: '1', target: '2' }, { id: 'e1-3', source: '1', target: '3' }];

export default function RoadmapPage() {
  const [nodes, setNodes] = useState(mockNodes);
  const [edges, setEdges] = useState(mockEdges);
  const [apiStatus, setApiStatus] = useState<'api' | 'mock'>('mock');

  useEffect(() => {
    (async () => {
      try {
        const summary = await apiRequest<Summary>('/dashboard/summary');
        const brandId = summary.brand?.id;
        if (!brandId) throw new Error('Brand not found');
        const boards = await apiRequest<Board[]>(`/roadmap/${brandId}`);
        const first = boards[0];
        if (!first) throw new Error('Board not found');

        const roadmapNodes = first.nodes.map((node) => ({ id: node.id, data: { label: node.label }, position: { x: node.x, y: node.y }, type: 'default' as const }));
        const roadmapEdges = roadmapNodes.slice(1).map((node, index) => ({ id: `e-${index}`, source: roadmapNodes[0].id, target: node.id }));

        setNodes(roadmapNodes);
        setEdges(roadmapEdges);
        setApiStatus('api');
      } catch {
        setApiStatus('mock');
      }
    })();
  }, []);

  return <div className="grid"><h1>Roadmap / схема</h1><p className="badge">Источник: {apiStatus === 'api' ? 'реальный API' : 'мок (временный fallback)'}</p><section className="card" style={{height:500}}><ReactFlow nodes={nodes} edges={edges} fitView><Background /><Controls /></ReactFlow></section></div>;
}
