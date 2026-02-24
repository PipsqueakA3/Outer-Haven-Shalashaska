import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { KnowledgeModule } from './knowledge/knowledge.module';
import { PrismaService } from './common/prisma.service';
import { TasksModule } from './tasks/tasks.module';
import { RoadmapModule } from './roadmap/roadmap.module';
import { UnitsModule } from './units/units.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, DashboardModule, KnowledgeModule, TasksModule, RoadmapModule, UnitsModule, SettingsModule],
  providers: [PrismaService]
})
export class AppModule {}
