import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { UnitsController } from './units.controller';

@Module({ controllers: [UnitsController], providers: [PrismaService] })
export class UnitsModule {}
