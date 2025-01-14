import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
export class AuthController {
  @Public()
  @Post('login')
  login(@Body() loginDto: any) {
    return { message: 'Login successful!' };
  }

  @Public()
  @Post('register')
  register(@Body() registerDto: any) {
    return { message: 'User registered successfully!' };
  }

  @Get('protected')
  getProtectedData() {
    return { message: 'You have accessed protected data!' };
  }
}