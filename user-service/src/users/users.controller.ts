// user-service/src/users/users.controller.ts

import { Controller, Get, Param, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // GET /users/me
  @Get('me')
  getMe(@Req() req: Request): UserDto {
    // ⚠️ Mock utilisateur – à remplacer par une vraie récupération via JWT
    const user = {
      id: '1',
      email: 'test@example.com',
      username: 'mockuser',
    } as User;

    return new UserDto(user);
  }

  // GET /users/:id
  @Get(':id')
  getById(@Param('id') id: string): UserDto {
    // ⚠️ Mock utilisateur par ID – à remplacer par un appel à usersService.findOne()
    const user = {
      id,
      email: `user${id}@example.com`,
      username: `user${id}`,
    } as User;

    return new UserDto(user);
  }
}
