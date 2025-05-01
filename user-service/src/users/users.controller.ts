// user-service/src/users/users.controller.ts

import { Controller, Get, Param, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users/me
  @Get('me')
  getMe(@Req() req: Request) {
    // Pour l'instant, on mocke : 
    // soit on décode le token dans `req.headers.authorization`
    // soit on renvoie un utilisateur fixe :
    return { id: '1', email: 'test@example.com' };
  }

  // GET /users/:id
  @Get(':id')
  getById(@Param('id') id: string) {
    // Mock ou, plus tard : return this.usersService.findOne(id);
    return { id, email: `user${id}@example.com` };
  }
}