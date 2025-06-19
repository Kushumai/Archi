import { Controller, Get, Post, Put, Delete, Param, Body, Req, UseGuards, UnauthorizedException } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { ServiceAuthGuard } from '../common/guards/service-auth.guard'

@UseGuards(ServiceAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll()
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id)
  }

  @Get('me')
  async getMe(@Req() req: any) {
    const userId = req.user?.sub
    if (!userId) throw new UnauthorizedException('User ID not found in token')
    return this.usersService.findById(userId)
  }

  @Post()
  async create(@Body() body: CreateUserDto) {
    return this.usersService.create(body)
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.usersService.update(id, body)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id)
  }
}