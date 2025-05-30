import { Controller, Get, Param, NotFoundException, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { UserDto } from './dto/user.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { User } from './entities/user.entity'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUser() user: User): Promise<UserDto> {
    return new UserDto(user)
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<UserDto> {
    const user = await this.usersService.findById(id)
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`)
    }
    return new UserDto(user)
  }
}
