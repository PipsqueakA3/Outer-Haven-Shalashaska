import * as argon2 from 'argon2';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  it('должен возвращать токен при валидном логине (мок)', async () => {
    const prisma: any = { user: { findUnique: jest.fn().mockResolvedValue({ id: '1', email: 'a@b.c', role: 'ADMIN', displayName: 'Тест', passwordHash: await argon2.hash('password123') }) } };
    const jwt: any = { sign: jest.fn().mockReturnValue('token') };
    const service = new AuthService(prisma, jwt);
    const result = await service.login('a@b.c', 'password123');
    expect(result.accessToken).toBe('token');
  });

  it('должен создать seed-админа при первом логине, если его нет в базе', async () => {
    const createdUser = { id: '2', email: 'admin@outerhaven.local', role: 'ADMIN', displayName: 'Михаил', passwordHash: await argon2.hash('Admin123!') };
    const prisma: any = {
      user: {
        findUnique: jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce(null),
        create: jest.fn().mockResolvedValue(createdUser)
      }
    };
    const jwt: any = { sign: jest.fn().mockReturnValue('token-admin') };
    const service = new AuthService(prisma, jwt);

    const result = await service.login('admin@outerhaven.local', 'Admin123!');

    expect(prisma.user.create).toHaveBeenCalled();
    expect(result.accessToken).toBe('token-admin');
  });

  it('должен отдавать понятную ошибку, если база недоступна', async () => {
    const prisma: any = {
      user: {
        findUnique: jest.fn().mockRejectedValue(new Error('db down'))
      }
    };
    const jwt: any = { sign: jest.fn() };
    const service = new AuthService(prisma, jwt);

    await expect(service.login('admin@outerhaven.local', 'Admin123!')).rejects.toThrow('Сервис входа временно недоступен: нет подключения к базе данных');
  });
});
