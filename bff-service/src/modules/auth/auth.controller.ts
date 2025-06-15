import {
  Controller,
  Post,
  Req,
  Res,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { Response, Request } from 'express'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; username: string; password: string }) {
    return this.authService.forwardRegister(body)
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.forwardLogin(body)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: false,
    })

    return { accessToken }
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken
    if (!refreshToken) {
      throw new HttpException('No refresh token', HttpStatus.UNAUTHORIZED)
    }

    const { accessToken, newRefreshToken } = await this.authService.forwardRefresh(refreshToken)

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: false,
    })

    return { accessToken }
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken', { path: '/' })
    return { message: 'Déconnecté' }
  }
}