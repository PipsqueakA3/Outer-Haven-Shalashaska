import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { KnowledgeController } from './knowledge.controller';

@Module({ controllers: [KnowledgeController], providers: [PrismaService] })
export class KnowledgeModule {}
