import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { LinkType, KnowledgePriority, KnowledgeStatus, KnowledgeVisibility, Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import { CreateKnowledgeItemDto, CreateTagDto, ListKnowledgeItemsQueryDto, UpdateKnowledgeItemDto } from './dto';

const withIncludes = {
  creator: { select: { id: true, displayName: true, email: true, role: true } },
  project: { select: { id: true, name: true } },
  stage: { select: { id: true, title: true } },
  task: { select: { id: true, title: true } },
  itemTags: { include: { tag: true } }
} satisfies Prisma.KnowledgeItemInclude;

@Injectable()
export class KnowledgeService {
  constructor(private prisma: PrismaService) {}

  private normalizeTags(tags?: string[]) {
    return [...new Set((tags || []).map((tag) => tag.trim()).filter(Boolean))];
  }

  private buildWhere(query: ListKnowledgeItemsQueryDto): Prisma.KnowledgeItemWhereInput {
    const tags = this.normalizeTags(query.tags);

    return {
      ...(query.type ? { type: query.type } : {}),
      ...(query.projectId ? { projectId: query.projectId } : {}),
      ...(query.stageId ? { stageId: query.stageId } : {}),
      ...(query.taskId ? { taskId: query.taskId } : {}),
      ...(query.creatorUserId ? { creatorUserId: query.creatorUserId } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.isFavorite !== undefined ? { isFavorite: query.isFavorite } : {}),
      ...(query.dateFrom || query.dateTo
        ? {
            updatedAt: {
              ...(query.dateFrom ? { gte: new Date(query.dateFrom) } : {}),
              ...(query.dateTo ? { lte: new Date(query.dateTo) } : {})
            }
          }
        : {}),
      ...(tags.length ? { itemTags: { some: { tag: { name: { in: tags, mode: 'insensitive' } } } } } : {}),
      ...(query.search
        ? {
            OR: [
              { title: { contains: query.search, mode: 'insensitive' } },
              { comment: { contains: query.search, mode: 'insensitive' } },
              { url: { contains: query.search, mode: 'insensitive' } },
              { itemTags: { some: { tag: { name: { contains: query.search, mode: 'insensitive' } } } } }
            ]
          }
        : {})
    };
  }

  private mapItem(item: Prisma.KnowledgeItemGetPayload<{ include: typeof withIncludes }>) {
    return {
      ...item,
      tags: item.itemTags.map((it) => it.tag.name)
    };
  }

  async list(query: ListKnowledgeItemsQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const where = this.buildWhere(query);
    const allowedSortFields = ['updatedAt', 'createdAt', 'title', 'priority', 'status', 'type'];
    const sortBy = allowedSortFields.includes(query.sortBy || '') ? query.sortBy! : 'updatedAt';
    const sortOrder = query.sortOrder || 'desc';

    const [total, items] = await this.prisma.$transaction([
      this.prisma.knowledgeItem.count({ where }),
      this.prisma.knowledgeItem.findMany({
        where,
        include: withIncludes,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit
      })
    ]);

    return {
      data: items.map((item) => this.mapItem(item)),
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
  }

  async getById(id: string) {
    const item = await this.prisma.knowledgeItem.findUnique({ where: { id }, include: withIncludes });
    if (!item) throw new NotFoundException('Материал не найден');
    return this.mapItem(item);
  }

  private async ensureEntityExists(dto: CreateKnowledgeItemDto | UpdateKnowledgeItemDto) {
    if (dto.projectId) {
      const project = await this.prisma.brand.findUnique({ where: { id: dto.projectId }, select: { id: true } });
      if (!project) throw new BadRequestException('Указанный проект не найден');
    }
    if (dto.stageId) {
      const stage = await this.prisma.stage.findUnique({ where: { id: dto.stageId }, select: { id: true } });
      if (!stage) throw new BadRequestException('Указанный этап не найден');
    }
    if (dto.taskId) {
      const task = await this.prisma.task.findUnique({ where: { id: dto.taskId }, select: { id: true } });
      if (!task) throw new BadRequestException('Указанная задача не найдена');
    }
  }

  private async resolveTags(tags: string[]) {
    const result = [] as Array<{ tagId: string }>;
    for (const tagName of tags) {
      const tag = await this.prisma.tag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName }
      });
      result.push({ tagId: tag.id });
    }
    return result;
  }

  async create(dto: CreateKnowledgeItemDto, userId: string) {
    await this.ensureEntityExists(dto);
    const tags = this.normalizeTags(dto.tags);

    const item = await this.prisma.knowledgeItem.create({
      data: {
        title: dto.title,
        url: dto.url,
        type: dto.type,
        projectId: dto.projectId,
        stageId: dto.stageId,
        taskId: dto.taskId,
        creatorUserId: userId,
        comment: dto.comment,
        accessHints: dto.accessHints || [],
        visibility: dto.visibility || KnowledgeVisibility.ADMIN_ONLY,
        status: dto.status || KnowledgeStatus.ACTIVE,
        priority: dto.priority || KnowledgePriority.MEDIUM,
        isFavorite: dto.isFavorite || false,
        itemTags: tags.length ? { createMany: { data: await this.resolveTags(tags) } } : undefined
      },
      include: withIncludes
    });

    return this.mapItem(item);
  }

  async update(id: string, dto: UpdateKnowledgeItemDto) {
    await this.getById(id);
    await this.ensureEntityExists(dto);
    const tags = dto.tags ? this.normalizeTags(dto.tags) : undefined;

    const item = await this.prisma.$transaction(async (tx) => {
      if (tags) {
        await tx.knowledgeItemTag.deleteMany({ where: { knowledgeItemId: id } });
        const mapped = await Promise.all(tags.map(async (tagName) => {
          const tag = await tx.tag.upsert({ where: { name: tagName }, update: {}, create: { name: tagName } });
          return { knowledgeItemId: id, tagId: tag.id };
        }));
        if (mapped.length) await tx.knowledgeItemTag.createMany({ data: mapped });
      }

      return tx.knowledgeItem.update({
        where: { id },
        data: {
          title: dto.title,
          url: dto.url,
          type: dto.type,
          projectId: dto.projectId,
          stageId: dto.stageId,
          taskId: dto.taskId,
          comment: dto.comment,
          accessHints: dto.accessHints,
          visibility: dto.visibility,
          status: dto.status,
          priority: dto.priority,
          isFavorite: dto.isFavorite
        },
        include: withIncludes
      });
    });

    return this.mapItem(item);
  }

  async remove(id: string) {
    await this.getById(id);
    await this.prisma.knowledgeItem.delete({ where: { id } });
    return { success: true };
  }

  async getMetaFilters() {
    const [projects, stages, tasks, creators, tags] = await Promise.all([
      this.prisma.brand.findMany({ select: { id: true, name: true } }),
      this.prisma.stage.findMany({ select: { id: true, title: true } }),
      this.prisma.task.findMany({ select: { id: true, title: true } }),
      this.prisma.user.findMany({ select: { id: true, displayName: true, email: true } }),
      this.prisma.tag.findMany({ orderBy: { name: 'asc' } })
    ]);

    return {
      types: Object.values(LinkType),
      statuses: Object.values(KnowledgeStatus),
      priorities: Object.values(KnowledgePriority),
      visibility: Object.values(KnowledgeVisibility),
      projects,
      stages,
      tasks,
      creators,
      tags
    };
  }

  listTags() {
    return this.prisma.tag.findMany({ orderBy: { name: 'asc' } });
  }

  async createTag(dto: CreateTagDto) {
    const normalized = dto.name.trim().toLowerCase();
    if (!normalized) throw new BadRequestException('Название тега не может быть пустым');
    return this.prisma.tag.upsert({ where: { name: normalized }, update: {}, create: { name: normalized } });
  }
}
