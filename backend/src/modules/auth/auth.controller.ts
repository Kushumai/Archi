import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createAuthDto: CreateAuthDto) {
    const hashedPassword = await this.authService.hashPassword(createAuthDto.password);
    return { message: 'User created successfully', password: hashedPassword };
  }

  @Post('login')
  async login(@Body() createAuthDto: CreateAuthDto ) {
    const { email, password } = createAuthDto;


    const user = await this.authService.findByEmail(email);
    
    if (!user) {
      return { message: 'User not found!' };
    }


    const isPasswordValid = await this.authService.comparePasswords(password, user.password);
    
    if (!isPasswordValid) {
      return { message: 'Invalid credentials!' };
    }


    return { message: 'Login successful!' };
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}