import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PrismaService } from '../common/prisma.service';

@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private prisma: PrismaService) {}

  @Get() all() { return this.prisma.appSetting.findMany(); }

  @Patch()
  update(@Body() body: { key: string; value: any }) {
    return this.prisma.appSetting.upsert({ where: { key: body.key }, update: { value: body.value }, create: { key: body.key, value: body.value } });
  }
}
