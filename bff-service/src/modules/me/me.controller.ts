import {
  Controller,
  Get,
  Headers,
  UnauthorizedException,
} from '@nestjs/common'
import { MeService } from './me.service'

@Controller('api/me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get()
  async getMe(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded = this.decodeJwt(token)

    return this.meService.getFullUserInfo(decoded.sub, token)
  }

  private decodeJwt(token: string): { sub: string } {
    try {
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      )
      if (!payload?.sub) {
        throw new Error()
      }
      return { sub: payload.sub }
    } catch {
      throw new UnauthorizedException('Invalid token')
    }
  }
}