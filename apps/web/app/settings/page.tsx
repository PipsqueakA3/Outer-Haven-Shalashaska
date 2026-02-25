'use client';

import { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api';

type AppSetting = { id: string; key: string; value: unknown };

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSetting[]>([]);
  const [apiStatus, setApiStatus] = useState<'api' | 'mock'>('mock');

  useEffect(() => {
    apiRequest<AppSetting[]>('/settings')
      .then((response) => {
        setSettings(response);
        setApiStatus('api');
      })
      .catch(() => setApiStatus('mock'));
  }, []);

  return <div className="grid"><h1>Базовые настройки MVP</h1><p className="badge">Источник: {apiStatus === 'api' ? 'реальный API' : 'частично заглушка'}</p><section className="card"><p>Редактируемые словари/статусы/теги будут расширяться в следующих итерациях.</p><ul><li>Статусы задач</li><li>Теги базы знаний</li><li>Названия блоков дашборда</li></ul>{settings.map((item) => <p key={item.id}><strong>{item.key}:</strong> {JSON.stringify(item.value)}</p>)}</section><section className="card"><h3>Future-ready модули (заглушки)</h3><p>Telegram alerts, расчётный движок, внутреннее хранилище файлов подготовлены архитектурно на backend.</p></section></div>;
}
