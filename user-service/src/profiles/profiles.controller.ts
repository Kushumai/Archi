import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) { }

  @Get()
  async findAll() {
    return this.profilesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.profilesService.findById(id);
  }

  @Post()
  async create(@Body() body: { userId: string; fullName: string; avatarUrl?: string; bio?: string }) {
    return this.profilesService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: { fullName?: string; avatarUrl?: string; bio?: string }) {
    return this.profilesService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.profilesService.delete(id);
  }
}