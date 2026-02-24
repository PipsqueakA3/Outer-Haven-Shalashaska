# Outer Haven MVP

## 1) Краткая архитектура
- **Frontend**: Next.js 14 (App Router, TypeScript), адаптивный UI, модульная навигация по блокам.
- **Backend**: NestJS + Prisma, JWT auth, защищённые API, Swagger `/api/docs`, валидация DTO.
- **БД**: PostgreSQL (через Prisma schema), нормализованные сущности под расширение в CRM/склад/операционку.
- **Безопасность**: Argon2 для паролей, Helmet/CORS, глобальная валидация, JWT guard, аудит-таблица.
- **Масштабирование**: монорепо, отдельные модули, future-ready интерфейсы (Telegram, расчёты, file storage provider).

## 2) Сущности и связи
`Brand -> Stage -> Task -> Subtask(Task.parentTaskId)`

Дополнительно:
- `RoadmapBoard -> RoadmapNode` (узел можно связать с Task)
- `KnowledgeItem` (ссылки/ресурсы, привязка к бренду/задаче)
- `LaunchLayer` (визуальная пирамида/дерево запуска)
- `UnitCard` (RPG-заглушка)
- `User/Role`, `AuditLog`, `AppSetting`

## 3) Страницы MVP
- `/dashboard` — прогресс бренда, ключевые этапы, сроки, пирамида.
- `/tasks` — задачи (список/канбан-ready).
- `/roadmap` — mind-map-like схема (React Flow).
- `/knowledge` — база знаний/ссылок.
- `/units` — карточки юнитов (демо).
- `/settings` — базовые словари/placeholder настройки.
- `/login` — демо-вход.

## 4) В MVP сейчас vs future-ready
### Сейчас реализовано
- Auth login endpoint + JWT guard.
- CRUD задач (основа), связи subtask.
- Dashboard summary.
- База знаний/ссылок.
- Roadmap board/nodes + link-to-task.
- Unit cards UI.
- Seed демо-данных.

### Future-ready placeholders
- Telegram alerts gateway.
- Calculation engine.
- Attachment/FileStorage provider (пока link-only).
- OTP flow endpoints (placeholder).
- RBAC foundation (enum roles + JWT payload).

## Быстрый запуск
```bash
cp .env.example .env
npm install
npm run prisma:generate -w apps/api
npm run prisma:migrate -w apps/api
npm run prisma:seed -w apps/api
npm run dev
```

## Демо-логин
- Email: `mikhail@outerhaven.local`
- Пароль: `Mikhail_OuterHaven_2026`

## Docker
```bash
docker compose up --build
```

## API docs
- `http://localhost:3001/api/docs`

## Стратегия бэкапов
- PostgreSQL: daily `pg_dump` + хранение в S3/объектном хранилище.
- Ротация: 14 daily + 8 weekly.
- Тест restore: минимум раз в месяц.
