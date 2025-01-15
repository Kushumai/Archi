import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import axios, { AxiosError } from 'axios';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { username, password } = loginDto;

    try {

      const response = await axios.post('http://archi_backend_dev:3000/api/user/validate', {
        username,
        password,
      });

      const { isValid, userId } = response.data;

      if (!isValid) {

        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { userId, username };
      console.log('>> process.env.JWT_SECRET =', process.env.JWT_SECRET);
      console.log('>> Fallback =', 'your-secret-key');
      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: '1h',
      });
      console.log('>> JWT_SECRET (auth-service) =', process.env.JWT_SECRET);

      return { accessToken };

    } catch (error) {

      console.error('Erreur dans AuthService.login:', (error as Error).message);

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 401) {
          throw new UnauthorizedException('Invalid credentials (from backend)');
        }
      }

      throw new InternalServerErrorException('Internal error during login');
    }
  }

  async register(registerDto: RegisterDto) {
    const response = await axios.post('http://archi_backend_dev:3000/api/user/register', registerDto);
    return response.data;
  }
}