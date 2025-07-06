import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { ServiceRequest } from '../types/service-request.type'

@Injectable()
export class ServiceAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<ServiceRequest>()
    const authHeader = request.headers['authorization']

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de service manquant')
    }

    const token = authHeader.replace('Bearer ', '')
    const secret = this.configService.getOrThrow<string>('SERVICE_SECRET')

    try {
      const payload = this.jwt.verify(token, { secret })

      if (!payload?.service) {
        throw new UnauthorizedException('Service non identifié')
      }

      ;(request as any).service = payload.service
      return true
    } catch {
      throw new UnauthorizedException('Token de service invalide')
    }
  }
}