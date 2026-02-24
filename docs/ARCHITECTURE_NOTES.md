# Architecture Notes

## Именование и стабильные ID
- Entity: `Brand` / table: `brand` / API: `/api/dashboard|tasks|roadmap` / FE module: `/dashboard` etc.
- Используются `cuid()` для всех сущностей (будущая горизонтальная масштабируемость).
- Стабильные slug для брендов: `outer-haven`.

## Почему такой стек
- Next.js + NestJS + Prisma дают быстрый MVP и чистое расширение.
- PostgreSQL и Prisma позволяют контролировать миграции и связи.
- React Flow ускоряет реализацию roadmap canvas UX.

## Расширение
- Telegram: реализовать `TelegramAlertsGateway` adapter и job queue (BullMQ).
- Расчёты: подключить отдельный `CalculationEngine` модуль с versioned formulas.
- Файлы: заменить `LinkOnlyAttachmentProvider` на S3/MinIO adapter.
- Роли: расширить guards/policies (CASL/ABAC), добавить department scopes.

## Future modules / Backlog architecture
- CRM лидов/партнёров
- Склад и партии материалов
- Финансы и cashflow
- Производственный календарь
- Интеграции (Telegram/Email/Google Workspace)
