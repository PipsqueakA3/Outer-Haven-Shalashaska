import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PrismaService } from '../common/prisma.service';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private prisma: PrismaService) {}

  @Get('summary')
  async summary() {
    const brand = await this.prisma.brand.findFirst({ include: { stages: true, launchLayers: true } });
    const dueTasks = await this.prisma.task.findMany({ where: { deadline: { not: null } }, take: 5, orderBy: { deadline: 'asc' } });
    return { brand, dueTasks };
  }
}
