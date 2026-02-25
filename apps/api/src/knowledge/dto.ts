import { LinkType, KnowledgePriority, KnowledgeStatus, KnowledgeVisibility } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUrl, Max, Min } from 'class-validator';

const parseBoolean = (value: unknown) => {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'boolean') return value;
  return String(value).toLowerCase() === 'true';
};

export class ListKnowledgeItemsQueryDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsEnum(LinkType) type?: LinkType;
  @IsOptional() @Transform(({ value }) => (typeof value === 'string' ? value.split(',').map((v) => v.trim()).filter(Boolean) : value)) @IsArray() @IsString({ each: true }) tags?: string[];
  @IsOptional() @IsString() projectId?: string;
  @IsOptional() @IsString() stageId?: string;
  @IsOptional() @IsString() taskId?: string;
  @IsOptional() @IsString() creatorUserId?: string;
  @IsOptional() @IsEnum(KnowledgeStatus) status?: KnowledgeStatus;
  @IsOptional() @Transform(({ value }) => parseBoolean(value)) @IsBoolean() isFavorite?: boolean;
  @IsOptional() @IsDateString() dateFrom?: string;
  @IsOptional() @IsDateString() dateTo?: string;
  @IsOptional() @IsString() sortBy?: string;
  @IsOptional() @Transform(({ value }) => (value === 'asc' ? 'asc' : value === 'desc' ? 'desc' : undefined)) sortOrder?: 'asc' | 'desc';
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number;
}

export class CreateKnowledgeItemDto {
  @IsString() title!: string;
  @IsUrl({}, { message: 'Поле "Ссылка" должно содержать корректный URL' }) url!: string;
  @IsEnum(LinkType) type!: LinkType;
  @IsOptional() @IsString() projectId?: string;
  @IsOptional() @IsString() stageId?: string;
  @IsOptional() @IsString() taskId?: string;
  @IsOptional() @IsString() comment?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) accessHints?: string[];
  @IsOptional() @IsEnum(KnowledgeVisibility) visibility?: KnowledgeVisibility;
  @IsOptional() @IsEnum(KnowledgeStatus) status?: KnowledgeStatus;
  @IsOptional() @IsEnum(KnowledgePriority) priority?: KnowledgePriority;
  @IsOptional() @IsBoolean() isFavorite?: boolean;
}

export class UpdateKnowledgeItemDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsUrl({}, { message: 'Поле "Ссылка" должно содержать корректный URL' }) url?: string;
  @IsOptional() @IsEnum(LinkType) type?: LinkType;
  @IsOptional() @IsString() projectId?: string;
  @IsOptional() @IsString() stageId?: string;
  @IsOptional() @IsString() taskId?: string;
  @IsOptional() @IsString() comment?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) accessHints?: string[];
  @IsOptional() @IsEnum(KnowledgeVisibility) visibility?: KnowledgeVisibility;
  @IsOptional() @IsEnum(KnowledgeStatus) status?: KnowledgeStatus;
  @IsOptional() @IsEnum(KnowledgePriority) priority?: KnowledgePriority;
  @IsOptional() @IsBoolean() isFavorite?: boolean;
}

export class CreateTagDto {
  @IsString() name!: string;
}
