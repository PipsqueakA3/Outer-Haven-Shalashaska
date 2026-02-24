import { Injectable } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  list(search?: string) {
    return this.prisma.task.findMany({
      where: search ? { title: { contains: search, mode: 'insensitive' } } : {},
      include: { subtasks: true, assignee: true, stage: true },
      orderBy: { updatedAt: 'desc' }
    });
  }

  create(data: any) { return this.prisma.task.create({ data }); }
  update(id: string, data: any) { return this.prisma.task.update({ where: { id }, data }); }
  delete(id: string) { return this.prisma.task.delete({ where: { id } }); }

  byBoard() {
    return Object.values(TaskStatus).map(async (status) => ({ status, tasks: await this.prisma.task.findMany({ where: { status } }) }));
  }
}
