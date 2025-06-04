import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  async create(@Body() body: { userId: string; fullName: string; avatarUrl?: string; bio?: string }) {
    return this.usersService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: { fullName?: string; avatarUrl?: string; bio?: string }) {
    return this.usersService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}