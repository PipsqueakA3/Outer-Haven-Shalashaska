import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { TasksService } from './tasks.service';

class CreateTaskDto {
  @IsString() stageId: string;
  @IsOptional() @IsString() parentTaskId?: string;
  @IsString() title: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsEnum(TaskStatus) status?: TaskStatus;
  @IsOptional() @IsEnum(TaskPriority) priority?: TaskPriority;
  @IsOptional() @IsDateString() deadline?: string;
  @IsOptional() @IsString() assigneeId?: string;
}

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasks: TasksService) {}

  @Get() list(@Query('search') search?: string) { return this.tasks.list(search); }
  @Post() create(@Body() dto: CreateTaskDto) { return this.tasks.create({ ...dto, deadline: dto.deadline ? new Date(dto.deadline) : undefined }); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: Partial<CreateTaskDto>) { return this.tasks.update(id, dto as any); }
  @Delete(':id') remove(@Param('id') id: string) { return this.tasks.delete(id); }
}
