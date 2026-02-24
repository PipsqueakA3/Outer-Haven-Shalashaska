import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { RoadmapController } from './roadmap.controller';

@Module({ controllers: [RoadmapController], providers: [PrismaService] })
export class RoadmapModule {}
