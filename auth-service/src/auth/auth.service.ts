import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/client'
import * as argon2 from 'argon2'
import { v4 as uuidv4 } from 'uuid'
import { HttpService } from '@nestjs/axios'
import { AxiosError } from 'axios'

@Injectable()
export class AuthService {
  private prisma = new PrismaClient()

  constructor(
    public readonly jwt: JwtService,
    public readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<void> {
      console.log("[AUTH] register called with", email, firstName, lastName);
    const existing = await this.prisma.authAccount.findUnique({ where: { email } })
    if (existing) {
      throw new BadRequestException('Email déjà utilisé')
    }

    const userId = uuidv4()
    const passwordHash = await argon2.hash(password)

    await this.prisma.authAccount.create({
      data: {
        id: userId,
        email,
        passwordHash,
      },
    })

    const userServiceUrl = this.config.getOrThrow('USER_SERVICE_URL')

    try {
      console.log("[AUTH] Avant POST user-service avec userId =", userId);
      await this.httpService.axiosRef.post(
        `${userServiceUrl}/api/v1/users`,
        {
          userId,
          firstName,
          lastName,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.generateServiceToken()}`,
          },
        },
      )
    } catch (error) {
        console.error("[AUTH] Erreur POST user-service:", error);
      const axiosError = error as AxiosError
      console.error('Erreur user-service :', axiosError.response?.data || axiosError.message)
      throw new InternalServerErrorException('Erreur côté user-service')
    }
  }

  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.prisma.authAccount.findUnique({ where: { email } })

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

  generateServiceToken(): string {
  return this.jwt.sign(
    { service: 'auth-service' },
    {
      secret: this.config.get('SERVICE_SECRET'),
      expiresIn: '10m',
    },
  )}

  async deleteUserAccount(id: string): Promise<void> {
  await this.prisma.authAccount.delete({ where: { id } });
  }

}