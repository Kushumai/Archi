import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  private users: User[] = [];

  constructor(private readonly jwtService: JwtService) {}

  async login(loginDto: LoginDto) {
    const user = this.users.find((u) => u.email === loginDto.email);
    if (!user || user.password !== loginDto.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const userExists = this.users.find((u) => u.email === registerDto.email);
    if (userExists) {
      throw new UnauthorizedException('User already exists');
    }

    const newUser = {
      id: this.users.length + 1,
      ...registerDto,
    };

    this.users.push(newUser);
    return { message: 'User registered successfully', user: newUser };
  }
}
