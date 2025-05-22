import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/client'
import * as argon2 from 'argon2'

@Injectable()
export class AuthService {
  private prisma = new PrismaClient()

  constructor(
    public readonly jwt: JwtService,
    public readonly config: ConfigService,
  ) { }

  async register(email: string, username: string, password: string): Promise<void> {
    const existing = await this.prisma.user.findUnique({ where: { email } })
    if (existing) {
      throw new BadRequestException('Email déjà utilisé')
    }

    const passwordHash = await argon2.hash(password)

    await this.prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
      },
    })
  }

  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } })

    if (!user || !(await argon2.verify(user.passwordHash, password))) {
      throw new UnauthorizedException('Identifiants invalides')
    }

    const payload = { sub: user.id, email: user.email }

    const accessToken = this.jwt.sign(payload, {
      expiresIn: `${this.config.get('ACCESS_TOKEN_TTL')}s`,
    })

    const refreshToken = this.jwt.sign(payload, {
      expiresIn: `${this.config.get('REFRESH_TOKEN_TTL')}s`,
    })

    return { accessToken, refreshToken }
  }

  signToken(userId: string, ttl: number | undefined): string {
    return this.jwt.sign({ sub: userId }, { expiresIn: `${ttl}s` })
  }
}