import { Injectable, UnauthorizedException } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class MeService {
  constructor(
    private readonly http: HttpService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async getMe(token: string) {
    const decoded = this.jwtService.decode(token) as { sub: string; email?: string }

    if (!decoded?.sub) {
      throw new UnauthorizedException('Invalid token')
    }

    const authServiceUrl = this.config.get<string>('AUTH_SERVICE_URL') || 'http://auth-service:3001'
    const userServiceUrl = this.config.get<string>('USER_SERVICE_URL') || 'http://user-service:3002'

    const [authRes, profileRes] = await Promise.all([
      this.http.axiosRef.get(`${authServiceUrl}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      }),

      this.http.axiosRef.get(`${userServiceUrl}/api/v1/users/me`, {
        headers: {
          Authorization: `Bearer ${this.generateServiceToken()}`,
        },
      }),
    ])

    return {
      ...authRes.data,
      profile: profileRes.data,
    }
  }

  private generateServiceToken(): string {
    return this.jwtService.sign(
      { service: 'bff-service' },
      {
        secret: this.config.get<string>('SERVICE_SECRET'),
        expiresIn: '10m',
      },
    )
  }
}