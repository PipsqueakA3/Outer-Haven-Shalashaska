import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { RoadmapNodeType } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PrismaService } from '../common/prisma.service';

class NodeDto {
  @IsString() label!: string;
  @IsEnum(RoadmapNodeType) type!: RoadmapNodeType;
  @IsNumber() x!: number;
  @IsNumber() y!: number;
}

@UseGuards(JwtAuthGuard)
@Controller('roadmap')
export class RoadmapController {
  constructor(private prisma: PrismaService) {}

  @Get(':brandId')
  list(@Param('brandId') brandId: string) {
    return this.prisma.roadmapBoard.findMany({ where: { brandId }, include: { nodes: true } });
  }

  @Post(':boardId/nodes')
  createNode(@Param('boardId') boardId: string, @Body() dto: NodeDto) {
    return this.prisma.roadmapNode.create({ data: { ...dto, boardId } });
  }

  @Patch('nodes/:id/link-task/:taskId')
  linkTask(@Param('id') id: string, @Param('taskId') taskId: string) {
    return this.prisma.roadmapNode.update({ where: { id }, data: { linkedTaskId: taskId } });
  }
}
