# Outer Haven — быстрый аудит и запуск (MVP)

## Что в проекте сейчас

### Структура
- `apps/web` — фронтенд на Next.js (App Router, русский интерфейс).
- `apps/api` — backend на NestJS + Prisma + JWT.
- `apps/api/prisma` — схема PostgreSQL и seed.
- `docker-compose.yml` — поднимает `db` + `api` + `web`.

### Что реально работает
- Авторизация: `POST /api/auth/login`, `GET /api/auth/me` (JWT).
- API с БД: `dashboard`, `tasks`, `knowledge`, `roadmap`, `units`, `settings`.
- Frontend подключён к API для страниц:
  - `/dashboard`
  - `/tasks`
  - `/knowledge`
  - `/roadmap` (с fallback на mock только если API недоступен)
  - `/units`
  - `/settings`
- Логин-страница `/login` выполняет реальный вход и сохраняет JWT.

### Что пока заглушка / future-ready
- `otp/request` в auth — placeholder.
- Провайдеры `telegram-alerts`, `calc-engine`, `attachment-provider` — placeholder-уровень.
- На странице roadmap есть fallback mock-данные только на случай недоступного backend API.

---

## Быстрый запуск

### Вариант 1: локально
```bash
cp .env.example .env
npm install
npm run prisma:generate -w apps/api
npm run prisma:migrate -w apps/api
npm run prisma:seed -w apps/api
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001/api`
- Swagger: `http://localhost:3001/api/docs`

### Вариант 2: Docker
```bash
docker compose up --build
```

---

## Тестовый админ (seed)
- Логин: `admin@outerhaven.local`
- Пароль: `Admin123!`
- Имя: `Михаил`

> Важно: эти учётные данные только для dev/теста.

---

## Краткий отчёт аудита

### Что уже было
- Монорепо с готовыми `web/api`.
- Prisma-схема и рабочие контроллеры NestJS.
- Базовый UI со страницами и навигацией.

### Что исправлено
- Подключён frontend к реальному backend API (не только статика).
- Добавлен рабочий логин через `/api/auth/login` с сохранением JWT.
- Добавлен logout и состояние входа в верхнем меню.
- Страницы сделаны интерактивными и кликабельными с загрузкой данных.
- Обновлён seed-админ на `admin@outerhaven.local / Admin123!`.
- Обновлён README под реальный запуск и тест.

### Что осталось заглушкой
- OTP-поток и интеграционные провайдеры (Telegram/расчёты/вложения).
- Часть UX для roadmap при падении API уходит в mock fallback.
