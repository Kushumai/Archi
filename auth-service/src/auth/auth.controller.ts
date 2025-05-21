import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { ConfigService } from '@nestjs/config'
import { Response, Request } from 'express'

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) { }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, password } = body
    const isValid = await this.auth.validateUser(email, password)

    if (!isValid) throw new UnauthorizedException('Invalid credentials')

    const accessTtl = parseInt(this.config.get('ACCESS_TOKEN_TTL') || '3600', 10)
    const refreshTtl = parseInt(this.config.get('REFRESH_TOKEN_TTL') || '86400', 10)

    const accessToken = this.auth.signToken('1', accessTtl)
    const refreshToken = this.auth.signToken('1', refreshTtl)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/api/auth/refresh',
      maxAge: refreshTtl * 1000,
    })

    return { accessToken }
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken } = req.cookies
    if (!refreshToken) throw new UnauthorizedException('No refresh token')

    let payload: any
    try {
      payload = await this.auth['jwt'].verifyAsync(refreshToken)
    } catch {
      throw new UnauthorizedException('Invalid refresh token')
    }

    const accessTtl = parseInt(this.config.get('ACCESS_TOKEN_TTL') || '3600', 10)
    const refreshTtl = parseInt(this.config.get('REFRESH_TOKEN_TTL') || '86400', 10)

    const newAccessToken = this.auth.signToken(payload.sub, accessTtl)
    const newRefreshToken = this.auth.signToken(payload.sub, refreshTtl)

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      path: '/api/auth/refresh',
      maxAge: refreshTtl * 1000,
    })

    return { accessToken: newAccessToken }
  }

  @Post('register')
  @HttpCode(201)
  register(@Body() body: any) {
    const { email, password, username } = body
    if (!email || !password || !username) {
      return { message: 'Missing fields' }
    }

    console.log(`[MOCK REGISTER] ${email}, ${username}`)
    return { message: 'User registered' }
  }
}
