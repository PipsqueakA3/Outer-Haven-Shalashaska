import { PrismaClient, TaskPriority, TaskStatus } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await argon2.hash('Admin123!');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@outerhaven.local' },
    update: {
      displayName: 'Михаил',
      passwordHash: adminPassword,
      role: 'ADMIN'
    },
    create: {
      email: 'admin@outerhaven.local',
      displayName: 'Михаил',
      passwordHash: adminPassword,
      role: 'ADMIN'
    }
  });

  await prisma.brand.deleteMany({ where: { slug: 'outer-haven' } });

  const brand = await prisma.brand.create({
    data: {
      slug: 'outer-haven',
      name: 'Outer Haven',
      description: 'Запуск нового бренда женской одежды'
    }
  });

  const strategy = await prisma.stage.create({ data: { brandId: brand.id, order: 1, title: 'Стратегия и позиционирование', progress: 45 } });
  await prisma.stage.create({ data: { brandId: brand.id, order: 2, title: 'Производство и поставщики', progress: 30 } });

  const task = await prisma.task.create({
    data: {
      stageId: strategy.id,
      title: 'Собрать бренд-платформу',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      assigneeId: admin.id,
      progress: 60
    }
  });

  await prisma.task.create({
    data: {
      stageId: strategy.id,
      parentTaskId: task.id,
      title: 'Утвердить tone of voice',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      assigneeId: admin.id,
      progress: 10
    }
  });

  await prisma.knowledgeItem.create({
    data: {
      brandId: brand.id,
      taskId: task.id,
      title: 'Мудборд коллекции AW26',
      url: 'https://www.figma.com/file/demo-aw26',
      type: 'OTHER',
      tags: ['мудборд', 'референсы'],
      creatorName: 'Михаил',
      accessMeta: 'admin@outerhaven.local'
    }
  });

  await prisma.roadmapBoard.create({
    data: {
      brandId: brand.id,
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

  await prisma.unitCard.deleteMany();
  await prisma.unitCard.createMany({
    data: [
      { name: 'Михаил', avatarColor: '#5B6CFF', strength: 8, speed: 7, agility: 6, stamina: 9, loyalty: 10, focus: 9 },
      { name: 'Леван', avatarColor: '#00A896', strength: 7, speed: 9, agility: 8, stamina: 7, loyalty: 8, focus: 8 }
    ]
  });

  await prisma.launchLayer.createMany({
    data: [
      { brandId: brand.id, title: 'Фундамент: бренд-стратегия', level: 1, progress: 55 },
      { brandId: brand.id, title: 'Операционка: продукт и производство', level: 2, progress: 33 },
      { brandId: brand.id, title: 'Рост: маркетинг и продажи', level: 3, progress: 20 }
    ]
  });

  await prisma.appSetting.upsert({
    where: { key: 'task_statuses' },
    update: { value: ['To Do', 'In Progress', 'Done', 'Blocked'] },
    create: {
      key: 'task_statuses',
      value: ['To Do', 'In Progress', 'Done', 'Blocked']
    }
  });
}

main().finally(() => prisma.$disconnect());
