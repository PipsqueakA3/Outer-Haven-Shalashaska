import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateKnowledgeItemDto, CreateTagDto, ListKnowledgeItemsQueryDto, UpdateKnowledgeItemDto } from './dto';
import { KnowledgeService } from './knowledge.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller()
export class KnowledgeController {
  constructor(private knowledgeService: KnowledgeService) {}

  @Get('knowledge-items')
  list(@Query() query: ListKnowledgeItemsQueryDto) {
    return this.knowledgeService.list(query);
  }

  @Get('knowledge-items/meta/filters')
  getMetaFilters() {
    return this.knowledgeService.getMetaFilters();
  }

  @Get('knowledge-items/:id')
  getById(@Param('id') id: string) {
    return this.knowledgeService.getById(id);
  }

  @Post('knowledge-items')
  create(@Body() dto: CreateKnowledgeItemDto, @Req() req: any) {
    return this.knowledgeService.create(dto, req.user.userId);
  }

  @Patch('knowledge-items/:id')
  update(@Param('id') id: string, @Body() dto: UpdateKnowledgeItemDto) {
    return this.knowledgeService.update(id, dto);
  }

  @Delete('knowledge-items/:id')
  remove(@Param('id') id: string) {
    return this.knowledgeService.remove(id);
  }

  @Get('tags')
  listTags() {
    return this.knowledgeService.listTags();
  }

  @Post('tags')
  createTag(@Body() dto: CreateTagDto) {
    return this.knowledgeService.createTag(dto);
  }
}
