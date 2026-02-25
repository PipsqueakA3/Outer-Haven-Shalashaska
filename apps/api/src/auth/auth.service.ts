import { Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from '../common/prisma.service';

const DEFAULT_ADMIN_EMAIL = 'admin@outerhaven.local';
const DEFAULT_ADMIN_PASSWORD = 'Admin123!';
const DEFAULT_ADMIN_NAME = 'Михаил';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  private async ensureDefaultAdmin(email: string, password: string): Promise<User | null> {
    if (email !== DEFAULT_ADMIN_EMAIL || password !== DEFAULT_ADMIN_PASSWORD) return null;

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) return existing;

    return this.prisma.user.create({
      data: {
        email: DEFAULT_ADMIN_EMAIL,
        displayName: DEFAULT_ADMIN_NAME,
        passwordHash: await argon2.hash(DEFAULT_ADMIN_PASSWORD),
        role: Role.ADMIN
      }
    });
  }

  async login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    let user: User | null;

    try {
      user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (!user) {
        user = await this.ensureDefaultAdmin(normalizedEmail, password);
      }
    } catch (error) {
      throw new ServiceUnavailableException('Сервис входа временно недоступен: нет подключения к базе данных');
    }

    if (!user || !(await argon2.verify(user.passwordHash, password))) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return { accessToken: this.jwt.sign(payload), user: { id: user.id, name: user.displayName, role: user.role } };
  }
}
