import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from '../../auth.service';
import * as argon2 from 'argon2';

jest.mock('argon2', () => ({
  verify: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService.register (unit)', () => {
  let service: AuthService;

  const prismaMock = {
    authAccount: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };
  const jwtMock = {} as any;
  const configMock = {
    getOrThrow: jest.fn(() => 'http://user-service'),
  };
  const httpServiceMock = {
    axiosRef: { post: jest.fn() },
  };

  beforeAll(() => {
    service = new AuthService(
      jwtMock,
      configMock as any,
      httpServiceMock as any,
    );
    (service as any).prisma = prismaMock;
    (service as any).generateServiceToken = () => 'fake-service-token';
  });

  beforeEach(() => {
    prismaMock.authAccount.findUnique.mockReset();
    prismaMock.authAccount.create.mockReset();
    httpServiceMock.axiosRef.post.mockReset();
    (argon2.hash as jest.Mock).mockReset();
  });

  it('doit lever BadRequestException si l’email existe déjà', async () => {
    prismaMock.authAccount.findUnique.mockResolvedValue({ id: 'x', email: 'a@b.c' });
    await expect(
      service.register('a@b.c', 'pwd', 'First', 'Last'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('doit créer un user et appeler user-service en cas de succès', async () => {
    prismaMock.authAccount.findUnique.mockResolvedValue(null);
    (argon2.hash as jest.Mock).mockResolvedValue('hashed-password');
    prismaMock.authAccount.create.mockResolvedValue({ id: 'new-id', email: 'a@b.c' });
    httpServiceMock.axiosRef.post.mockResolvedValue({ status: 201 });

    await expect(
      service.register('a@b.c', 'pwd', 'First', 'Last'),
    ).resolves.toBeUndefined();

    expect(argon2.hash).toHaveBeenCalledWith('pwd');
    expect(prismaMock.authAccount.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: 'a@b.c',
          passwordHash: 'hashed-password',
        }),
      }),
    );
    expect(httpServiceMock.axiosRef.post).toHaveBeenCalledWith(
      'http://user-service/api/v1/users',
      { userId: expect.any(String), firstName: 'First', lastName: 'Last' },
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer fake-service-token',
        }),
      }),
    );
  });

  it('doit lever InternalServerErrorException si user-service échoue', async () => {
    prismaMock.authAccount.findUnique.mockResolvedValue(null);
    (argon2.hash as jest.Mock).mockResolvedValue('hashed-password');
    prismaMock.authAccount.create.mockResolvedValue({ id: 'new-id', email: 'a@b.c' });
    httpServiceMock.axiosRef.post.mockRejectedValue(new Error('fail'));

    await expect(
      service.register('a@b.c', 'pwd', 'First', 'Last'),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });
});