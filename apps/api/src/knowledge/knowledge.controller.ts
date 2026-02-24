import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { LinkType } from '@prisma/client';
import { IsArray, IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PrismaService } from '../common/prisma.service';

class CreateLinkDto {
  @IsString() brandId: string;
  @IsString() title: string;
  @IsUrl() url: string;
  @IsEnum(LinkType) type: LinkType;
  @IsArray() tags: string[];
  @IsString() creatorName: string;
  @IsOptional() @IsString() comment?: string;
}

@UseGuards(JwtAuthGuard)
@Controller('knowledge')
export class KnowledgeController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list(@Query('search') search?: string) {
    return this.prisma.knowledgeItem.findMany({ where: search ? { title: { contains: search, mode: 'insensitive' } } : {}, orderBy: { updatedAt: 'desc' } });
  }

  @Post()
  create(@Body() dto: CreateLinkDto) {
    return this.prisma.knowledgeItem.create({ data: dto });
  }
}
