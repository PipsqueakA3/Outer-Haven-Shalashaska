import { AuthService } from './auth.service';

describe('AuthService', () => {
  it('должен возвращать токен при валидном логине (мок)', async () => {
    const prisma: any = { user: { findUnique: jest.fn().mockResolvedValue({ id: '1', email: 'a@b.c', role: 'ADMIN', displayName: 'Тест', passwordHash: await require('argon2').hash('password123') }) } };
    const jwt: any = { sign: jest.fn().mockReturnValue('token') };
    const service = new AuthService(prisma, jwt);
    const result = await service.login('a@b.c', 'password123');
    expect(result.accessToken).toBe('token');
  });
});
