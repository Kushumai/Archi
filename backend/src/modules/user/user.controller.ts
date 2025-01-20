import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from '../../shared/decorators/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Public()
  @Post('validate')
  async validate(@Body() loginDto: LoginDto) {
    const user = await this.userService.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      return { isValid: false, userId: null };
    }

    return { isValid: true, userId: user.id };
  }
}