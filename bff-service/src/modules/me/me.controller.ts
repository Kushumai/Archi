import {
  Controller,
  Get,
  Headers,
  UnauthorizedException,
} from '@nestjs/common'
import { MeService } from './me.service'

@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get()
  async getMe(@Headers('authorization') authHeader: string) {
      console.log('>>> getMe called')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header')
    }

    const token = authHeader.replace('Bearer ', '')

    return this.meService.getMe(token)
  }
}