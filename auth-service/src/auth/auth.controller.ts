import {
  Body,
  Controller,
  Post,
  Res,
  Req,
} from '@nestjs/common'
import { Response, Request } from 'express'
import { AuthService } from './auth.service'

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/register')
  async register(
    @Body() body: { email: string; username: string; password: string },
  ) {
    const { email, username, password } = body
    await this.authService.register(email, username, password)
    return { message: 'Utilisateur enregistré' }
  }

  @Post('/login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, password } = body
    const { accessToken, refreshToken } = await this.authService.login(email, password)

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
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
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
    } catch {
      return res.status(401).json({ message: 'Invalid refresh token' })
    }
  }

  private parseMaxAge(): number {
    const ttl = this.authService.config.get<number>('REFRESH_TOKEN_TTL')
    return (ttl || 7 * 24 * 3600) * 1000
  }
}
