import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PrismaService } from '../common/prisma.service';

@UseGuards(JwtAuthGuard)
@Controller('units')
export class UnitsController {
  constructor(private prisma: PrismaService) {}
  @Get() list() { return this.prisma.unitCard.findMany(); }
}
