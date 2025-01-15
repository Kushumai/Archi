import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    console.log('>> URL demandée :', request.url);
    console.log('>> Headers :', request.headers);


    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) {
      console.log('>> Route marquée @Public(), on bypass...');
      return true;
    }

    if (this.isInternalRequest(request)) {
      console.log('>> Requête considérée "interne", bypass en dev...');
      return true;
    }


    const token = this.extractTokenFromHeader(request);
    console.log('>> Token extrait :', token);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      console.log('>> Payload décodé :', payload);
      request['user'] = payload;
      return true;
    } catch (error) {
      console.error('JWT Validation Error:', (error as Error).message);
      throw new UnauthorizedException('Invalid token');
    }
  }


  private isInternalRequest(request: Request): boolean {
    const origin = request.headers.origin || '';
    const internalOrigins = ['archi_auth_service_dev', 'archi_frontend_dev'];


    return process.env.NODE_ENV === 'development' &&
           internalOrigins.some((service) => origin.includes(service));
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }
    return undefined;
  }
}
