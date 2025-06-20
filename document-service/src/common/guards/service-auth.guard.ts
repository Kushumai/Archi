import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ServiceAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    try {
      const serviceSecret = this.configService.get<string>('SERVICE_SECRET');
      if (!serviceSecret) {
        throw new Error('SERVICE_SECRET is not defined in the environment');
      }

      const payload = jwt.verify(token, serviceSecret) as {
        sub: string;
        email?: string;
        role?: string;
      };

      request.user = {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    };

      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}