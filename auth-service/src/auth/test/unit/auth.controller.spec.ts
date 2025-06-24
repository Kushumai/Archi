import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from '../../auth.controller';
import { AuthService } from '../../auth.service';
import { LoginDto } from '../../dto/login.dto';
import { Response } from 'express';

describe('AuthController (unit)', () => {
  let controller: AuthController;
  let authServiceMock: Partial<AuthService>;
  let resMock: Partial<Response>;

  beforeAll(() => {
    authServiceMock = {
      login: jest.fn(),
    };
    controller = new AuthController(authServiceMock as AuthService);
    (controller as any).parseMaxAge = jest.fn(() => 1234);
  });

  beforeEach(() => {
    (authServiceMock.login as jest.Mock).mockReset();
    resMock = {
      cookie: jest.fn(),
    } as any;
  });

  it('doit définir le cookie et retourner accessToken en cas de succès', async () => {
    (authServiceMock.login as jest.Mock).mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    const dto: LoginDto = { email: 'u@e.com', password: 'pwd' };
    const result = await controller.login(dto, resMock as Response);

    expect(authServiceMock.login).toHaveBeenCalledWith('u@e.com', 'pwd');
    expect(resMock.cookie).toHaveBeenCalledWith(
      'refreshToken',
      'refresh-token',
      {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: false,
        maxAge: 1234,
      },
    );
    expect(result).toEqual({ accessToken: 'access-token' });
  });

  it('doit lancer UnauthorizedException si AuthService.login échoue', async () => {
    (authServiceMock.login as jest.Mock).mockRejectedValue(new UnauthorizedException());

    await expect(
      controller.login({ email: 'x', password: 'y' }, resMock as Response),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
