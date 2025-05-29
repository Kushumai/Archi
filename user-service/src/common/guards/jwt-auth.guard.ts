import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService) { }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<CustomRequest>();
    const token = this.extractToken(req);

    if (!token) {
      throw new UnauthorizedException('Token manquant');
    }

    const secret = this.config.get<string>('JWT_SECRET');
    if (!secret) throw new UnauthorizedException('JWT_SECRET non défini');

    try {
      const decoded = verify(token, secret);
      req.user = decoded;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token invalide');
    }
  }

  private extractToken(req: Request): string | null {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }

    const cookieToken = req.cookies?.refreshToken;
    return cookieToken ?? null;
  }
}

interface CustomRequest extends Request {
  user?: any;
}