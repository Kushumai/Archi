// src/users/users.controller.ts

import {
  Controller,
  Get,
  Param,
  Req,
  NotFoundException,
  UseGuards,
} from '@nestjs/common'
import { Request } from 'express'
import { UsersService } from './users.service'
import { UserDto } from './dto/user.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { User } from './entities/user.entity'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // GET /users/:id
  @Get(':id')
  async getById(@Param('id') id: string): Promise<UserDto> {
    const user = await this.usersService.findById(id)
    if (!user) throw new NotFoundException('Utilisateur non trouvé')
    return new UserDto(user)
  }

  // GET /users/me
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUser() user: User): Promise<UserDto> {
    return new UserDto(user)
  }
}
