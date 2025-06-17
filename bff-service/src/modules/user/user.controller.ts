import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Headers,
  UnauthorizedException,
} from '@nestjs/common'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(@Headers('authorization') authHeader: string) {
    const token = this.extractToken(authHeader)
    return this.userService.findAll(token)
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Headers('authorization') authHeader: string) {
    const token = this.extractToken(authHeader)
    return this.userService.findById(id, token)
  }

  @Post()
  async create(
    @Body() body: { userId: string; fullName: string; avatarUrl?: string; bio?: string },
    @Headers('authorization') authHeader: string,
  ) {
    const token = this.extractToken(authHeader)
    return this.userService.create(body, token)
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { fullName?: string; avatarUrl?: string; bio?: string },
    @Headers('authorization') authHeader: string,
  ) {
    const token = this.extractToken(authHeader)
    return this.userService.update(id, body, token)
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Headers('authorization') authHeader: string) {
    const token = this.extractToken(authHeader)
    return this.userService.delete(id, token)
  }

  private extractToken(authHeader: string): string {
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization header missing or malformed')
    }
    return authHeader.replace('Bearer ', '')
  }
}
