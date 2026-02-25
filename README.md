# Outer Haven — MVP с рабочим модулем базы знаний

## Что реализовано

- Рабочий вход `/login` (JWT, хеш пароля через argon2).
- Защита внутренних страниц на frontend (проверка токена + `/api/auth/me`) и защищённые API.
- Seed-админ:
  - **email:** `admin@outerhaven.local`
  - **password:** `Admin123!`
  - **name:** `Михаил`
  - **role:** `ADMIN`
- Полноценный модуль **«База знаний и ссылок»**:
  - backend CRUD + фильтры + пагинация;
  - реальные данные в БД (Prisma);
  - frontend со вкладками, фильтрами, таблицей/карточками, модалками, превью/fallback.
- Foundation для RBAC: роли + role guard + поле видимости (`ADMIN_ONLY / ALL / ROLE_BASED`).

---

## URL

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001/api`
- Swagger: `http://localhost:3001/api/docs`
- Страница входа: `http://localhost:3000/login`
- Страница модуля: `http://localhost:3000/knowledge`

---

## Какие страницы защищены

Проверка авторизации включена для:

- `/dashboard`
- `/tasks`
- `/roadmap`
- `/knowledge`
- `/units`
- `/settings`

Неавторизованный пользователь редиректится на `/login`.

---

## База данных: добавленные модели/поля

Обновлена модель `KnowledgeItem`:

- `projectId` (FK на `Brand`, опционально)
- `stageId` (FK на `Stage`, опционально)
- `taskId` (FK на `Task`, опционально)
- `creatorUserId` (FK на `User`, обязательно)
- `title`, `url`, `type`
- `comment`
- `accessHints` (`String[]`)
- `visibility` (`ADMIN_ONLY | ALL | ROLE_BASED`)
- `status` (`ACTIVE | DRAFT | ARCHIVED`)
- `priority` (`LOW | MEDIUM | HIGH | CRITICAL`)
- `isFavorite`
- `createdAt`, `updatedAt`

Добавлены:

- `Tag`
- `KnowledgeItemTag` (m2m)

---

## API модуля базы знаний

### Материалы

- `GET /api/knowledge-items`
- `GET /api/knowledge-items/:id`
- `POST /api/knowledge-items`
- `PATCH /api/knowledge-items/:id`
- `DELETE /api/knowledge-items/:id`
- `GET /api/knowledge-items/meta/filters`

### Теги

- `GET /api/tags`
- `POST /api/tags`

### Query params для `GET /api/knowledge-items`

- `search`
- `type`
- `tags` (через запятую)
- `projectId`
- `stageId`
- `taskId`
- `creatorUserId`
- `status`
- `isFavorite`
- `dateFrom`
- `dateTo`
- `sortBy`
- `sortOrder`
- `page`
- `limit`

Поиск идет по `title`, `comment`, `url`, `tags`.

> Сейчас CRUD ограничен ролью `ADMIN`.

---

## Seed-данные

Добавлены демо-данные:

- админ `Михаил`
- проект `Outer Haven`
- этапы/задачи для реальных связей в селектах
- 12 материалов базы знаний:
  - Мудборд коллекции AW26
  - Финмодель запуска бренда
  - ТЗ на лекала (база)
  - Таблица поставщиков тканей
  - Контент-план бренда на запуск
  - Референсы упаковки
  - Сценарий первой съёмки
  - Бренд-платформа (драфт)
  - Таблица блогеров для теста
  - Чек-лист производства образцов
  - Таблица себестоимости капсулы
  - Референсы визуала карточек товара
- теги:
  - мудборд
  - финансы
  - маркетинг
  - производство
  - контент
  - поставщики
  - референсы
  - бренд

---

## Локальный запуск

```bash
cp .env.example .env
cp .env apps/api/.env
npm install
npm run prisma:generate -w apps/api
npm run prisma:migrate -w apps/api
npm run prisma:seed -w apps/api
npm run dev
```

---

## Временные ограничения

- В текущем окружении миграции/seed требуют доступный PostgreSQL на `localhost:5432`.
- Для удобства добавлен SQL-файл миграции, сгенерированный через `prisma migrate diff`.


## Временный режим доступа

- В текущей ветке вход отключён для dev-демо: frontend не требует логин, backend `JwtAuthGuard` пропускает запросы как `ADMIN`.
