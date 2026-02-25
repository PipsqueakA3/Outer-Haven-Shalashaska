'use client';

import { CSSProperties, FormEvent, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { useRequireAuth } from '../../lib/useRequireAuth';

type LinkType = 'GOOGLE_DOC' | 'GOOGLE_SHEET' | 'GOOGLE_SLIDES' | 'YANDEX_DISK' | 'OTHER';
type Status = 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
type Visibility = 'ADMIN_ONLY' | 'ALL' | 'ROLE_BASED';

type Option = { id: string; name?: string; title?: string; displayName?: string; email?: string };
type KnowledgeItem = {
  id: string;
  title: string;
  url: string;
  type: LinkType;
  tags: string[];
  project?: { id: string; name: string } | null;
  stage?: { id: string; title: string } | null;
  task?: { id: string; title: string } | null;
  creator: { id: string; displayName: string; email: string };
  status: Status;
  priority: Priority;
  visibility: Visibility;
  comment?: string | null;
  accessHints: string[];
  isFavorite: boolean;
  updatedAt: string;
};

type ListResponse = { data: KnowledgeItem[]; total: number; page: number; pages: number; limit: number };
type MetaFilters = {
  types: LinkType[];
  statuses: Status[];
  priorities: Priority[];
  visibility: Visibility[];
  projects: Option[];
  stages: Option[];
  tasks: Option[];
  creators: Option[];
  tags: Array<{ id: string; name: string }>;
};

const ruMap: Record<string, string> = {
  GOOGLE_DOC: 'Google Doc',
  GOOGLE_SHEET: 'Google Sheet',
  GOOGLE_SLIDES: 'Google Slides',
  YANDEX_DISK: 'Яндекс.Диск',
  OTHER: 'Другое',
  ACTIVE: 'Активный',
  DRAFT: 'Черновик',
  ARCHIVED: 'В архиве',
  LOW: 'Низкий',
  MEDIUM: 'Средний',
  HIGH: 'Высокий',
  CRITICAL: 'Критичный',
  ADMIN_ONLY: 'Только админ',
  ALL: 'Все',
  ROLE_BASED: 'По ролям'
};

const isEmbeddable = (item: KnowledgeItem) => !item.url.includes('disk.yandex.ru') && (item.type === 'GOOGLE_DOC' || item.type === 'GOOGLE_SHEET' || item.type === 'GOOGLE_SLIDES');

const defaultForm = {
  title: '',
  url: '',
  type: 'OTHER' as LinkType,
  projectId: '',
  stageId: '',
  taskId: '',
  comment: '',
  tags: '',
  accessHints: '',
  visibility: 'ADMIN_ONLY' as Visibility,
  status: 'ACTIVE' as Status,
  priority: 'MEDIUM' as Priority,
  isFavorite: false
};

export default function KnowledgePage() {
  const ready = useRequireAuth();
  const [tab, setTab] = useState<'knowledge' | 'links'>('knowledge');
  const [view, setView] = useState<'table' | 'cards'>('table');
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [meta, setMeta] = useState<MetaFilters | null>(null);
  const [selected, setSelected] = useState<KnowledgeItem | null>(null);
  const [editing, setEditing] = useState<KnowledgeItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '', type: '', tags: '', projectId: '', stageId: '', taskId: '', creatorUserId: '', status: '', dateFrom: '', dateTo: '', isFavorite: '', sortBy: 'updatedAt', sortOrder: 'desc'
  });
  const [form, setForm] = useState(defaultForm);

  const endpointQuery = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    params.set('page', String(page));
    params.set('limit', '20');
    if (tab === 'knowledge') params.set('type', 'GOOGLE_DOC');
    return `?${params.toString()}`;
  }, [filters, page, tab]);

  async function loadMeta() {
    const response = await apiFetch<MetaFilters>('/knowledge-items/meta/filters');
    setMeta(response);
  }

  async function loadItems() {
    setLoading(true);
    setError('');
    try {
      const response = await apiFetch<ListResponse>(`/knowledge-items${endpointQuery}`);
      setItems(response.data);
      setPages(Math.max(response.pages, 1));
    } catch (err) {
      setError('Не удалось загрузить материалы. Проверьте доступ к API и авторизацию.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!ready) return;
    loadMeta().catch(() => setError('Не удалось загрузить фильтры модуля.'));
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    loadItems();
  }, [ready, endpointQuery]);

  function openCreateModal() {
    setEditing(null);
    setForm(defaultForm);
    setShowForm(true);
  }

  function openEditModal(item: KnowledgeItem) {
    setEditing(item);
    setForm({
      title: item.title,
      url: item.url,
      type: item.type,
      projectId: item.project?.id || '',
      stageId: item.stage?.id || '',
      taskId: item.task?.id || '',
      comment: item.comment || '',
      tags: item.tags.join(', '),
      accessHints: item.accessHints.join(', '),
      visibility: item.visibility,
      status: item.status,
      priority: item.priority,
      isFavorite: item.isFavorite
    });
    setShowForm(true);
  }

  async function submitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const payload = {
      title: form.title.trim(),
      url: form.url.trim(),
      type: form.type,
      projectId: form.projectId || undefined,
      stageId: form.stageId || undefined,
      taskId: form.taskId || undefined,
      comment: form.comment || undefined,
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      accessHints: form.accessHints.split(',').map((email) => email.trim()).filter(Boolean),
      visibility: form.visibility,
      status: form.status,
      priority: form.priority,
      isFavorite: form.isFavorite
    };

    if (!payload.title || !payload.url) {
      setError('Заполните обязательные поля: название и ссылка.');
      return;
    }

    try {
      if (editing) {
        await apiFetch(`/knowledge-items/${editing.id}`, { method: 'PATCH', body: JSON.stringify(payload) });
      } else {
        await apiFetch('/knowledge-items', { method: 'POST', body: JSON.stringify(payload) });
      }
      setShowForm(false);
      await loadItems();
    } catch (err: any) {
      setError(err?.message || 'Не удалось сохранить материал.');
    }
  }

  async function removeItem(id: string) {
    if (!confirm('Удалить материал?')) return;
    try {
      await apiFetch(`/knowledge-items/${id}`, { method: 'DELETE' });
      if (selected?.id === id) setSelected(null);
      await loadItems();
    } catch {
      setError('Не удалось удалить материал.');
    }
  }

  async function quickPatch(item: KnowledgeItem, patch: Partial<Pick<KnowledgeItem, 'isFavorite' | 'status'>>) {
    try {
      await apiFetch(`/knowledge-items/${item.id}`, { method: 'PATCH', body: JSON.stringify(patch) });
      await loadItems();
    } catch {
      setError('Не удалось обновить материал.');
    }
  }

  if (!ready) return <p>Проверка авторизации...</p>;

  return (
    <div className="grid" style={{ gap: 14 }}>
      <h1>База знаний и ссылок</h1>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="badge" style={{ border: 0, cursor: 'pointer', background: tab === 'knowledge' ? '#dbeafe' : '#eef4ff' }} onClick={() => setTab('knowledge')}>База знаний</button>
        <button className="badge" style={{ border: 0, cursor: 'pointer', background: tab === 'links' ? '#dbeafe' : '#eef4ff' }} onClick={() => setTab('links')}>Ссылки и файлы</button>
      </div>

      <section className="card grid" style={{ gap: 10 }}>
        <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <input placeholder="Поиск по названию, комментарию, тегам, URL" value={filters.search} onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))} style={inputStyle} />
          <select value={filters.type} onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))} style={inputStyle}><option value="">Тип</option>{meta?.types.map((v) => <option key={v} value={v}>{ruMap[v]}</option>)}</select>
          <input placeholder="Теги (через запятую)" value={filters.tags} onChange={(e) => setFilters((prev) => ({ ...prev, tags: e.target.value }))} style={inputStyle} />
          <select value={filters.projectId} onChange={(e) => setFilters((prev) => ({ ...prev, projectId: e.target.value }))} style={inputStyle}><option value="">Проект</option>{meta?.projects.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}</select>
          <select value={filters.stageId} onChange={(e) => setFilters((prev) => ({ ...prev, stageId: e.target.value }))} style={inputStyle}><option value="">Этап</option>{meta?.stages.map((v) => <option key={v.id} value={v.id}>{v.title}</option>)}</select>
          <select value={filters.taskId} onChange={(e) => setFilters((prev) => ({ ...prev, taskId: e.target.value }))} style={inputStyle}><option value="">Задача</option>{meta?.tasks.map((v) => <option key={v.id} value={v.id}>{v.title}</option>)}</select>
          <select value={filters.creatorUserId} onChange={(e) => setFilters((prev) => ({ ...prev, creatorUserId: e.target.value }))} style={inputStyle}><option value="">Создатель</option>{meta?.creators.map((v) => <option key={v.id} value={v.id}>{v.displayName}</option>)}</select>
          <select value={filters.status} onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))} style={inputStyle}><option value="">Статус</option>{meta?.statuses.map((v) => <option key={v} value={v}>{ruMap[v]}</option>)}</select>
          <input type="date" value={filters.dateFrom} onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))} style={inputStyle} />
          <input type="date" value={filters.dateTo} onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))} style={inputStyle} />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="badge" style={buttonStyle} onClick={openCreateModal}>Добавить материал</button>
            <button className="badge" style={{ ...buttonStyle, background: view === 'table' ? '#dbeafe' : '#eef4ff' }} onClick={() => setView('table')}>Таблица</button>
            <button className="badge" style={{ ...buttonStyle, background: view === 'cards' ? '#dbeafe' : '#eef4ff' }} onClick={() => setView('cards')}>Карточки</button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="badge" style={buttonStyle} onClick={() => setFilters({ search: '', type: '', tags: '', projectId: '', stageId: '', taskId: '', creatorUserId: '', status: '', dateFrom: '', dateTo: '', isFavorite: '', sortBy: 'updatedAt', sortOrder: 'desc' })}>Сбросить</button>
          </div>
        </div>
      </section>

      {error && <p style={{ color: '#b42318' }}>{error}</p>}
      {loading && <p>Загрузка материалов...</p>}

      {view === 'table' ? (
        <section className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 980 }}>
            <thead><tr>{['Название', 'Тип', 'Теги', 'Привязка', 'Создатель', 'Статус', 'Приоритет', 'Избр.', 'Обновлено', 'Действия'].map((h) => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ borderTop: '1px solid #eaecf0' }}>
                  <td style={tdStyle}><strong>{item.title}</strong></td>
                  <td style={tdStyle}>{ruMap[item.type]}</td>
                  <td style={tdStyle}>{item.tags.join(', ') || '—'}</td>
                  <td style={tdStyle}>{item.project?.name || '—'} / {item.stage?.title || '—'} / {item.task?.title || '—'}</td>
                  <td style={tdStyle}>{item.creator.displayName}</td>
                  <td style={tdStyle}>{ruMap[item.status]}</td>
                  <td style={tdStyle}>{ruMap[item.priority]}</td>
                  <td style={tdStyle}>{item.isFavorite ? '★' : '☆'}</td>
                  <td style={tdStyle}>{new Date(item.updatedAt).toLocaleDateString('ru-RU')}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      <a className="badge" style={linkBtn} href={item.url} target="_blank">Открыть</a>
                      <button className="badge" style={buttonStyle} onClick={() => setSelected(item)}>Подробнее</button>
                      <button className="badge" style={buttonStyle} onClick={() => openEditModal(item)}>Редактировать</button>
                      <button className="badge" style={buttonStyle} onClick={() => removeItem(item.id)}>Удалить</button>
                      <button className="badge" style={buttonStyle} onClick={() => quickPatch(item, { isFavorite: !item.isFavorite })}>{item.isFavorite ? 'Убрать из избр.' : 'В избранное'}</button>
                      <button className="badge" style={buttonStyle} onClick={() => quickPatch(item, { status: 'ARCHIVED' })}>Архивировать</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        <div className="grid grid-3">
          {items.map((item) => (
            <article key={item.id} className="card" style={{ display: 'grid', gap: 8 }}>
              <strong>{item.title}</strong>
              <div>Тип: {ruMap[item.type]}</div>
              <div>Теги: {item.tags.join(', ') || '—'}</div>
              <div>Статус: {ruMap[item.status]} · Приоритет: {ruMap[item.priority]}</div>
              <div>Обновлено: {new Date(item.updatedAt).toLocaleDateString('ru-RU')}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <a className="badge" style={linkBtn} href={item.url} target="_blank">Открыть</a>
                <button className="badge" style={buttonStyle} onClick={() => setSelected(item)}>Подробнее</button>
                <button className="badge" style={buttonStyle} onClick={() => openEditModal(item)}>Редактировать</button>
              </div>
            </article>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button className="badge" style={buttonStyle} disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Назад</button>
        <span>Страница {page} / {pages}</span>
        <button className="badge" style={buttonStyle} disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Вперёд</button>
      </div>

      {selected && (
        <div style={overlay} onClick={() => setSelected(null)}>
          <div className="card" style={modal} onClick={(e) => e.stopPropagation()}>
            <h3>{selected.title}</h3>
            <p><strong>Ссылка:</strong> <a href={selected.url} target="_blank">{selected.url}</a></p>
            <p><strong>Тип:</strong> {ruMap[selected.type]} · <strong>Видимость:</strong> {ruMap[selected.visibility]}</p>
            <p><strong>Описание:</strong> {selected.comment || '—'}</p>
            <p><strong>Теги:</strong> {selected.tags.join(', ') || '—'}</p>
            <p><strong>Доступ (подсказки):</strong> {selected.accessHints.join(', ') || '—'}</p>
            {isEmbeddable(selected) ? (
              <iframe src={selected.url} style={{ width: '100%', height: 300, border: '1px solid #e4e7ec', borderRadius: 10 }} />
            ) : (
              <div className="card" style={{ background: '#f9fafb' }}>
                <p style={{ margin: 0, fontSize: 28 }}>📎</p>
                <p style={{ marginBottom: 10 }}>Предпросмотр недоступен</p>
                <a className="badge" style={linkBtn} href={selected.url} target="_blank">Открыть ссылку</a>
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <a className="badge" style={linkBtn} href={selected.url} target="_blank">Открыть в новой вкладке</a>
              <button className="badge" style={buttonStyle} onClick={() => setSelected(null)}>Закрыть</button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div style={overlay} onClick={() => setShowForm(false)}>
          <form className="card grid" style={modal} onClick={(e) => e.stopPropagation()} onSubmit={submitForm}>
            <h3>{editing ? 'Редактирование материала' : 'Добавление материала'}</h3>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8 }}>
              <input style={inputStyle} placeholder="Название" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />
              <input style={inputStyle} placeholder="Ссылка" value={form.url} onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))} required />
              <select style={inputStyle} value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as LinkType }))}>{meta?.types.map((v) => <option key={v} value={v}>{ruMap[v]}</option>)}</select>
              <select style={inputStyle} value={form.projectId} onChange={(e) => setForm((p) => ({ ...p, projectId: e.target.value }))}><option value="">Проект</option>{meta?.projects.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}</select>
              <select style={inputStyle} value={form.stageId} onChange={(e) => setForm((p) => ({ ...p, stageId: e.target.value }))}><option value="">Этап</option>{meta?.stages.map((v) => <option key={v.id} value={v.id}>{v.title}</option>)}</select>
              <select style={inputStyle} value={form.taskId} onChange={(e) => setForm((p) => ({ ...p, taskId: e.target.value }))}><option value="">Задача</option>{meta?.tasks.map((v) => <option key={v.id} value={v.id}>{v.title}</option>)}</select>
              <select style={inputStyle} value={form.visibility} onChange={(e) => setForm((p) => ({ ...p, visibility: e.target.value as Visibility }))}>{meta?.visibility.map((v) => <option key={v} value={v}>{ruMap[v]}</option>)}</select>
              <select style={inputStyle} value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as Status }))}>{meta?.statuses.map((v) => <option key={v} value={v}>{ruMap[v]}</option>)}</select>
              <select style={inputStyle} value={form.priority} onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value as Priority }))}>{meta?.priorities.map((v) => <option key={v} value={v}>{ruMap[v]}</option>)}</select>
              <input style={inputStyle} placeholder="Теги (через запятую)" value={form.tags} onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))} />
              <input style={inputStyle} placeholder="Access hints email (через запятую)" value={form.accessHints} onChange={(e) => setForm((p) => ({ ...p, accessHints: e.target.value }))} />
              <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}><input type="checkbox" checked={form.isFavorite} onChange={(e) => setForm((p) => ({ ...p, isFavorite: e.target.checked }))} /> Избранное</label>
            </div>
            <textarea style={{ ...inputStyle, minHeight: 90 }} placeholder="Комментарий" value={form.comment} onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))} />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button type="button" className="badge" style={buttonStyle} onClick={() => setShowForm(false)}>Отмена</button>
              <button type="submit" className="badge" style={buttonStyle}>{editing ? 'Сохранить' : 'Создать'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const inputStyle: CSSProperties = { width: '100%', padding: 10, borderRadius: 10, border: '1px solid #d0d5dd', background: '#fff' };
const buttonStyle: CSSProperties = { border: 0, cursor: 'pointer' };
const linkBtn: CSSProperties = { border: 0, cursor: 'pointer', background: '#eef4ff' };
const thStyle: CSSProperties = { textAlign: 'left', padding: '8px 6px', fontSize: 12, color: '#475467' };
const tdStyle: CSSProperties = { padding: '10px 6px', verticalAlign: 'top', fontSize: 14 };
const overlay: CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(16,24,40,0.45)', display: 'grid', placeItems: 'center', zIndex: 30, padding: 12 };
const modal: CSSProperties = { width: 'min(980px, 100%)', maxHeight: '90vh', overflow: 'auto' };
