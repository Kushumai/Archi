import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return this.userService.findAll()
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.userService.findById(id)
  }

  @Post()
  async create(
    @Body() body: { userId: string; fullName: string; avatarUrl?: string; bio?: string },
  ) {
    return this.userService.create(body)
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { fullName?: string; avatarUrl?: string; bio?: string },
  ) {
    return this.userService.update(id, body)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(id)
  }
}
