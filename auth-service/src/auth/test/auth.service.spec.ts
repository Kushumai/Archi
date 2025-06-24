import { UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { AuthService } from '../../auth/auth.service';

jest.mock('argon2', () => ({
  verify: jest.fn(),
}));

describe('AuthService (unit)', () => {
  let service: AuthService;

  const mockUser = {
    id: 'user-id-123',
    email: 'test@example.com',
    passwordHash: 'hashed-password',
  };

  const prismaMock = {
    user: { findUnique: jest.fn() },
  };

  const jwtServiceMock = { sign: jest.fn() };
  const configServiceMock = { get: jest.fn(() => 3600) };

  beforeAll(() => {
    service = new AuthService(
      jwtServiceMock as any,
      configServiceMock as any,
      {} as any,
    );

    (service as any).prisma = prismaMock;
  });

  beforeEach(() => {
    prismaMock.user.findUnique.mockReset();
    (argon2.verify as jest.Mock).mockReset();
    jwtServiceMock.sign.mockReset();
  });

  it('devrait renvoyer accessToken et refreshToken quand les identifiants sont valides', async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    (argon2.verify as jest.Mock).mockResolvedValue(true);
    jwtServiceMock.sign
      .mockReturnValueOnce('access-token')
      .mockReturnValueOnce('refresh-token');

    const result = await service.login(mockUser.email, 'plain-password');

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { email: mockUser.email } });
    expect(argon2.verify).toHaveBeenCalledWith(mockUser.passwordHash, 'plain-password');
    expect(jwtServiceMock.sign).toHaveBeenNthCalledWith(
      1,
      { sub: mockUser.id, email: mockUser.email },
      { expiresIn: '3600s' },
    );
    expect(jwtServiceMock.sign).toHaveBeenNthCalledWith(
      2,
      { sub: mockUser.id, email: mockUser.email },
      { expiresIn: '3600s' },
    );
    expect(result).toEqual({ accessToken: 'access-token', refreshToken: 'refresh-token' });
  });

  it('devrait lever UnauthorizedException si l’email est inconnu', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    await expect(service.login('nope@example.com', 'pwd'))
      .rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('devrait lever UnauthorizedException si le mot de passe est incorrect', async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    (argon2.verify as jest.Mock).mockResolvedValue(false);
    await expect(service.login(mockUser.email, 'bad-password'))
      .rejects.toBeInstanceOf(UnauthorizedException);
  });
});
