import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaClient } from '@prisma/client'
import * as argon2 from 'argon2'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  private prisma = new PrismaClient()

  constructor(
    private jwt: JwtService,
    private config: ConfigService,
  ) { }

  async register(email: string, username: string, password: string) {
    const passwordHash = await argon2.hash(password)

    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
      },
    })

    return { message: 'User registered', id: user.id }
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })

    if (!user || !(await argon2.verify(user.passwordHash, password))) {
      throw new UnauthorizedException('Invalid credentials')
    }

    return user
  }

  signToken(userId: string): string {
    const secret = this.config.get<string>('JWT_SECRET') ?? 'default-secret'
    return this.jwt.sign({ sub: userId }, { secret, expiresIn: '15m' })
  }

  signRefreshToken(userId: string): string {
    const secret = this.config.get<string>('JWT_SECRET') ?? 'default-secret'
    return this.jwt.sign({ sub: userId }, {
      secret,
      expiresIn: '7d',
    })
  }
}