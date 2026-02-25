# Outer Haven — быстрый аудит и запуск тестового стенда

## Что уже было
- **Frontend** на Next.js с русским UI и рабочей навигацией по разделам (`/dashboard`, `/tasks`, `/roadmap`, `/knowledge`, `/units`, `/settings`, `/login`).
- **Backend** на NestJS + Prisma с JWT-авторизацией и API-модулями (`auth`, `dashboard`, `tasks`, `roadmap`, `knowledge`, `units`, `settings`).
- **DB**: PostgreSQL схема в Prisma.

## Что исправлено в этом аудите
- Подключил frontend-страницы к backend API (через `NEXT_PUBLIC_API_URL` и Bearer JWT).
- Сделал рабочий login flow: форма логина, сохранение токена, переход в дашборд.
- Добавил seed админа с полными правами:
  - Логин: `admin@outerhaven.local`
  - Пароль: `Admin123!`
  - Имя: `Михаил`
- Уточнил и стабилизировал seed для повторного запуска (пересоздание основных демо-данных бренда).
- Пометил в UI источник данных: где **реальный API**, а где включился **временный мок fallback**.

## Что пока остаётся заглушкой
- `POST /api/auth/otp/request` — placeholder.
- Провайдеры в `apps/api/src/providers/*` (telegram/calc-engine/attachments) — архитектурные заготовки.
- На frontend fallback-моки активируются, если API недоступен или нет валидного JWT.

---

## Структура проекта
- `apps/web` — frontend (Next.js)
- `apps/api` — backend (NestJS + Prisma)
- `apps/api/prisma` — схема и seed базы

## Быстрый запуск (локально)
1. Поднять PostgreSQL (например, Docker):
   ```bash
   docker compose up -d db
   ```
2. Установить зависимости:
   ```bash
   npm install
   ```
3. Подготовить env:
   ```bash
   cp .env.example .env
   ```
4. Сгенерировать Prisma client и применить схему:
   ```bash
   npm run prisma:generate -w apps/api
   npx prisma db push --schema apps/api/prisma/schema.prisma
   ```
5. Засидировать тестовые данные:
   ```bash
   npm run prisma:seed -w apps/api
   ```
6. Запустить frontend + backend:
   ```bash
   npm run dev
   ```

## Куда заходить
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001/api`
- Swagger: `http://localhost:3001/api/docs`

## Тестовые доступы
- Email: `admin@outerhaven.local`
- Пароль: `Admin123!`

## Краткий отчёт (для теста)
- **Уже было:** каркас frontend/backend/db, базовые API-эндпоинты, статические страницы.
- **Исправил:** связал UI с API, сделал рабочий вход, добавил тестового админа, обновил документацию запуска.
- **Осталось заглушкой:** OTP и интеграционные провайдеры; мок-данные как fallback при недоступном API.
