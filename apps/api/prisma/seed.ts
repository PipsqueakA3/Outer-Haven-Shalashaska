import { KnowledgePriority, KnowledgeStatus, KnowledgeVisibility, LinkType, PrismaClient, Role, TaskPriority, TaskStatus } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await argon2.hash('Admin123!');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@outerhaven.local' },
    update: { displayName: 'Михаил', role: Role.ADMIN, passwordHash: adminPassword },
    create: {
      email: 'admin@outerhaven.local',
      displayName: 'Михаил',
      passwordHash: adminPassword,
      role: Role.ADMIN
    }
  });

  const project = await prisma.brand.upsert({
    where: { slug: 'outer-haven' },
    update: {
      name: 'Outer Haven',
      description: 'Запуск нового бренда женской одежды'
    },
    create: {
      slug: 'outer-haven',
      name: 'Outer Haven',
      description: 'Запуск нового бренда женской одежды'
    }
  });

  await prisma.knowledgeItemTag.deleteMany();
  await prisma.knowledgeItem.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.stage.deleteMany();
  await prisma.tag.deleteMany();

  const strategy = await prisma.stage.create({ data: { brandId: project.id, order: 1, title: 'Стратегия и позиционирование', progress: 45 } });
  const production = await prisma.stage.create({ data: { brandId: project.id, order: 2, title: 'Производство и поставщики', progress: 30 } });
  const marketing = await prisma.stage.create({ data: { brandId: project.id, order: 3, title: 'Маркетинг и запуск', progress: 25 } });

  const brandPlatformTask = await prisma.task.create({
    data: {
      stageId: strategy.id,
      title: 'Собрать бренд-платформу',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      assigneeId: admin.id,
      progress: 60
    }
  });

  const suppliersTask = await prisma.task.create({
    data: {
      stageId: production.id,
      title: 'Собрать пул поставщиков тканей',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      assigneeId: admin.id,
      progress: 20
    }
  });

  const contentTask = await prisma.task.create({
    data: {
      stageId: marketing.id,
      title: 'Подготовить контент-план запуска',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MEDIUM,
      assigneeId: admin.id,
      progress: 40
    }
  });

  const tags = ['мудборд', 'финансы', 'маркетинг', 'производство', 'контент', 'поставщики', 'референсы', 'бренд'];
  const tagMap = new Map<string, string>();
  for (const name of tags) {
    const tag = await prisma.tag.create({ data: { name } });
    tagMap.set(name, tag.id);
  }

  const items: Array<{
    title: string;
    url: string;
    type: LinkType;
    tags: string[];
    stageId?: string;
    taskId?: string;
    comment?: string;
    status?: KnowledgeStatus;
    priority?: KnowledgePriority;
    visibility?: KnowledgeVisibility;
    favorite?: boolean;
    accessHints?: string[];
  }> = [
    { title: 'Мудборд коллекции AW26', url: 'https://www.figma.com/file/demo-aw26', type: LinkType.OTHER, tags: ['мудборд', 'референсы'], stageId: strategy.id, taskId: brandPlatformTask.id, priority: KnowledgePriority.HIGH, favorite: true },
    { title: 'Финмодель запуска бренда', url: 'https://docs.google.com/spreadsheets/d/demo-finmodel', type: LinkType.GOOGLE_SHEET, tags: ['финансы', 'бренд'], stageId: strategy.id, status: KnowledgeStatus.ACTIVE, priority: KnowledgePriority.CRITICAL },
    { title: 'ТЗ на лекала (база)', url: 'https://docs.google.com/document/d/demo-patterns', type: LinkType.GOOGLE_DOC, tags: ['производство'], stageId: production.id, taskId: suppliersTask.id },
    { title: 'Таблица поставщиков тканей', url: 'https://docs.google.com/spreadsheets/d/demo-suppliers', type: LinkType.GOOGLE_SHEET, tags: ['поставщики', 'производство'], stageId: production.id, taskId: suppliersTask.id, favorite: true },
    { title: 'Контент-план бренда на запуск', url: 'https://docs.google.com/spreadsheets/d/demo-content-plan', type: LinkType.GOOGLE_SHEET, tags: ['контент', 'маркетинг'], stageId: marketing.id, taskId: contentTask.id, priority: KnowledgePriority.HIGH },
    { title: 'Референсы упаковки', url: 'https://disk.yandex.ru/i/demo-packaging', type: LinkType.YANDEX_DISK, tags: ['референсы', 'бренд'], stageId: production.id },
    { title: 'Сценарий первой съёмки', url: 'https://docs.google.com/document/d/demo-shoot', type: LinkType.GOOGLE_DOC, tags: ['контент', 'маркетинг'], stageId: marketing.id, taskId: contentTask.id },
    { title: 'Бренд-платформа (драфт)', url: 'https://docs.google.com/document/d/demo-brand-platform', type: LinkType.GOOGLE_DOC, tags: ['бренд'], stageId: strategy.id, taskId: brandPlatformTask.id, status: KnowledgeStatus.DRAFT },
    { title: 'Таблица блогеров для теста', url: 'https://docs.google.com/spreadsheets/d/demo-bloggers', type: LinkType.GOOGLE_SHEET, tags: ['маркетинг'], stageId: marketing.id },
    { title: 'Чек-лист производства образцов', url: 'https://docs.google.com/document/d/demo-samples', type: LinkType.GOOGLE_DOC, tags: ['производство'], stageId: production.id },
    { title: 'Таблица себестоимости капсулы', url: 'https://docs.google.com/spreadsheets/d/demo-costs', type: LinkType.GOOGLE_SHEET, tags: ['финансы', 'производство'], stageId: production.id, priority: KnowledgePriority.CRITICAL },
    { title: 'Референсы визуала карточек товара', url: 'https://disk.yandex.ru/i/demo-product-cards', type: LinkType.YANDEX_DISK, tags: ['референсы', 'контент'], stageId: marketing.id, status: KnowledgeStatus.ARCHIVED }
  ];

  for (const item of items) {
    const created = await prisma.knowledgeItem.create({
      data: {
        projectId: project.id,
        stageId: item.stageId,
        taskId: item.taskId,
        title: item.title,
        url: item.url,
        type: item.type,
        creatorUserId: admin.id,
        comment: item.comment,
        accessHints: item.accessHints || ['admin@outerhaven.local'],
        visibility: item.visibility || KnowledgeVisibility.ADMIN_ONLY,
        status: item.status || KnowledgeStatus.ACTIVE,
        priority: item.priority || KnowledgePriority.MEDIUM,
        isFavorite: Boolean(item.favorite)
      }
    });

    await prisma.knowledgeItemTag.createMany({
      data: item.tags.map((tag) => ({ knowledgeItemId: created.id, tagId: tagMap.get(tag)! }))
    });
  }

  await prisma.roadmapBoard.create({
    data: {
      brandId: project.id,
      title: 'Схема запуска Q2',
      nodes: {
        create: [
          { label: 'Запуск бренда', type: 'STAGE', x: 0, y: 0 },
          { label: 'Контент-стратегия', type: 'TASK', x: 220, y: -80 },
          { label: 'Пул поставщиков', type: 'TASK', x: 220, y: 80 }
        ]
      }
    }
  });

  await prisma.unitCard.createMany({
    data: [
      { name: 'Михаил', avatarColor: '#5B6CFF', strength: 8, speed: 7, agility: 6, stamina: 9, loyalty: 10, focus: 9 },
      { name: 'Леван', avatarColor: '#00A896', strength: 7, speed: 9, agility: 8, stamina: 7, loyalty: 8, focus: 8 }
    ]
  });

  await prisma.launchLayer.createMany({
    data: [
      { brandId: project.id, title: 'Фундамент: бренд-стратегия', level: 1, progress: 55 },
      { brandId: project.id, title: 'Операционка: продукт и производство', level: 2, progress: 33 },
      { brandId: project.id, title: 'Рост: маркетинг и продажи', level: 3, progress: 20 }
    ]
  });

  await prisma.appSetting.upsert({
    where: { key: 'task_statuses' },
    update: {},
    create: {
      key: 'task_statuses',
      value: ['To Do', 'In Progress', 'Done', 'Blocked']
    }
  });
}

main().finally(() => prisma.$disconnect());
