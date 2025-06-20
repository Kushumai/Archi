import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; username: string; password: string }) {
    return this.authService.forwardRegister(body);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }, @Res() res: Response) {
    const { data, setCookie } = await this.authService.forwardLogin(body);

  if (setCookie) {
    const cookieHeader = Array.isArray(setCookie) ? setCookie : [setCookie];
    res.setHeader('Set-Cookie', cookieHeader);
  }

    return res.json(data);
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const cookieHeader = req.headers.cookie
      console.log('🍪 BFF → Received cookie header from client:', cookieHeader)
    if (!cookieHeader) {
      throw new HttpException('No cookie header', HttpStatus.UNAUTHORIZED)
    }

    const { data, setCookie } = await this.authService.forwardRefresh(cookieHeader)

    if (setCookie) {
      const cookieHeader = Array.isArray(setCookie) ? setCookie : [setCookie];
      res.setHeader('Set-Cookie', cookieHeader);
    } else {
      console.log('⚠️ BFF → No Set-Cookie received from auth-service');
    }
    return data
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken', { path: '/' });
    return { message: 'Déconnecté' };
  }
}