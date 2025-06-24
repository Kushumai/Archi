import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import * as argon2 from 'argon2';

describe('AuthService.register (unit)', () => {
  let service: AuthService;

  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };
  const jwtMock = {} as any;
  const configMock = { getOrThrow: jest.fn(() => 'http://user-service') };
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
  });

  beforeEach(() => {
    prismaMock.user.findUnique.mockReset();
    prismaMock.user.create.mockReset();
    httpServiceMock.axiosRef.post.mockReset();
  });

  it('doit lever BadRequestException si l’email existe déjà', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: 'x', email: 'a@b.c' });
    await expect(
      service.register('a@b.c', 'pwd', 'First', 'Last'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('doit créer un user et appeler user-service en cas de succès', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({ id: 'new-id', email: 'a@b.c' });
    httpServiceMock.axiosRef.post.mockResolvedValue({ status: 201 });

    await expect(
      service.register('a@b.c', 'pwd', 'First', 'Last'),
    ).resolves.toBeUndefined();

    expect(prismaMock.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: 'a@b.c',
        }),
      }),
    );
    expect(httpServiceMock.axiosRef.post).toHaveBeenCalledWith(
      'http://user-service/api/v1/users',
      { userId: expect.any(String), firstName: 'First', lastName: 'Last' },
      expect.any(Object),
    );
  });

  it('doit lever InternalServerErrorException si user-service échoue', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({ id: 'new-id', email: 'a@b.c' });
    httpServiceMock.axiosRef.post.mockRejectedValue(new Error('fail'));

    await expect(
      service.register('a@b.c', 'pwd', 'First', 'Last'),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });
});