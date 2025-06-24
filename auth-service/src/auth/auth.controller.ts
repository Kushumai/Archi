import {
  Body,
  Controller,
  Post,
  Res,
  Req,
  Get,
  UseGuards,
} from '@nestjs/common'
import { Response, Request } from 'express'
import { AuthService } from './auth.service'
import { AuthRequest } from '../common/types/auth-request.type'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { LoginDto } from './dto/login.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/register')
  async register(
    @Body() body: { email: string; password: string;  firstName: string; lastName: string },
  ) {
    const { email, password, firstName, lastName } = body
    await this.authService.register(email, password, firstName, lastName)
    return { message: 'Utilisateur enregistré' }
  }

  @Post('/login')
    async login(
      @Body() loginDto: LoginDto,
      @Res({ passthrough: true }) res: Response,
    ) {
      const { accessToken, refreshToken } = await this.authService.login(
        loginDto.email,
        loginDto.password,
      );
      console.log('[auth/login] Set-Cookie for refreshToken:', refreshToken);
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: false,
        maxAge: this.parseMaxAge(),
      });
    
      return { accessToken };
    }
  @Post('/refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken;
  
    if (!refreshToken) {
      console.log('❌ AUTH → No refresh token found');
      return res.status(401).json({ message: 'No refresh token' });
    }
  
    try {
      const payload = await this.authService.jwt.verifyAsync(refreshToken);
      console.log('✅ AUTH → Refresh token valid for user:', payload.sub);
      const accessToken = this.authService.signToken(payload.sub, this.authService.config.get('ACCESS_TOKEN_TTL'));
      const newRefreshToken = this.authService.signToken(payload.sub, this.authService.config.get('REFRESH_TOKEN_TTL'));
    
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: false,
        maxAge: this.parseMaxAge(),
      });
    
      return { accessToken };
    } catch (err) {
      console.log('❌ AUTH → Invalid refresh token:', (err as Error)?.message);
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
  }

  @Post('/logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken', {
      path: '/',
    })

    return { message: 'Déconnecté' }
  }

  private parseMaxAge(): number {
    const ttl = this.authService.config.get<number>('REFRESH_TOKEN_TTL')
    return (ttl || 7 * 24 * 3600) * 1000
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getMe(@Req() req: AuthRequest) {
  const { sub, email, role } = req.user
  console.log('ROUTE OK')
    return {
      id: sub,
      email: email ?? null,
      role: role ?? 'user',
    }
  }

  @Get('service-token')
  getServiceToken() {
  return this.authService.generateServiceToken()
  }
}
