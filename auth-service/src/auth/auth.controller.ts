import {
  Body,
  Controller,
  Post,
  Res,
  Req,
  Get,
  UseGuards,
  Delete,
  Param,
  Request as NestRequest,
} from '@nestjs/common'
import { Response, Request as ExpressRequest } from 'express'
import { AuthService } from './auth.service'
import { ServiceAuthGuard } from './guards/service-auth.guard'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { LoginDto } from './dto/login.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteOwnAccount(@NestRequest() req: ExpressRequest) {
    console.log('DELETE /me headers:', req.headers)
    console.log('DELETE /me req.user:', (req as any).user)
    await this.authService.deleteUserAccount((req as any).user.sub)
    return { message: 'Compte supprimé' }
  }

  @Post('/register')
  async register(
    @Body() body: { email: string; password: string; firstName: string; lastName: string },
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
    )
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: false,
      maxAge: this.parseMaxAge(),
    })
    return { accessToken }
  }

  @Post('/refresh')
  async refresh(@Req() req: ExpressRequest, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken
    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token' })
    }
    try {
      const payload = await this.authService.jwt.verifyAsync(refreshToken)
      const accessToken = this.authService.signToken(payload.sub, this.authService.config.get('ACCESS_TOKEN_TTL'))
      const newRefreshToken = this.authService.signToken(payload.sub, this.authService.config.get('REFRESH_TOKEN_TTL'))
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: false,
        maxAge: this.parseMaxAge(),
      })
      return { accessToken }
    } catch (err) {
      return res.status(401).json({ message: 'Invalid refresh token' })
    }
  }

  @Post('/logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken', {
      path: '/',
    })
    return { message: 'Déconnecté' }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getMe(@NestRequest() req: ExpressRequest) {
    const user = (req as any).user
    const { sub, email, role } = user
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

  @UseGuards(ServiceAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.authService.deleteUserAccount(id)
    return { message: 'Compte supprimé' }
  }

  private parseMaxAge(): number {
    const ttl = this.authService.config.get<number>('REFRESH_TOKEN_TTL')
    return (ttl || 7 * 24 * 3600) * 1000
  }
}
