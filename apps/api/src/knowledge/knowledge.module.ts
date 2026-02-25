import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { RolesGuard } from '../auth/roles.guard';
import { KnowledgeController } from './knowledge.controller';
import { KnowledgeService } from './knowledge.service';

@Module({
  controllers: [KnowledgeController],
  providers: [PrismaService, RolesGuard, KnowledgeService]
})
export class KnowledgeModule {}
