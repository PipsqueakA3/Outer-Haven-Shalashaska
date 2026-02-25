'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { useRequireAuth } from '../../lib/useRequireAuth';

type AppSetting = { id: string; key: string; value: unknown };

export default function SettingsPage() {
  const ready = useRequireAuth();
  const [settings, setSettings] = useState<AppSetting[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready) return;
    apiFetch<AppSetting[]>('/settings').then(setSettings).catch(() => setError('Не удалось загрузить настройки из API.'));
  }, [ready]);

  if (!ready) return <p>Проверка авторизации...</p>;

  return (
    <div className="grid">
      <h1>Базовые настройки MVP</h1>
      <p className="badge" style={{ width: 'fit-content' }}>Источник данных: реальный API</p>
      {error && <p style={{ color: '#b42318' }}>{error}</p>}
      <section className="card">
        <p>Редактируемые словари/статусы/теги будут расширяться в следующих итерациях.</p>
        <ul>{settings.map((s) => <li key={s.id}><strong>{s.key}</strong>: {JSON.stringify(s.value)}</li>)}</ul>
      </section>
      <section className="card"><h3>Future-ready модули</h3><p>Telegram alerts, расчётный движок, внутреннее хранилище файлов подготовлены архитектурно на backend.</p></section>
    </div>
  );
}
