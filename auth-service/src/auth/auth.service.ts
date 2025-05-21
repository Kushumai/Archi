import { Injectable } from '@nestjs/common'
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  private testUser = {
    id: '1',
    email: 'test@example.com',
    passwordHash: '', // sera généré au démarrage
  }

  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {
    this.hashTestPassword()
    console.log('[DEBUG] JWT_SECRET =', this.config.get('JWT_SECRET'))
  }

  private async hashTestPassword() {
    this.testUser.passwordHash = await argon2.hash('password123')
  }

  async validateUser(email: string, password: string): Promise<boolean> {
    return (
      email === this.testUser.email &&
      await argon2.verify(this.testUser.passwordHash, password)
    )
  }

  signToken(userId: string, ttl: number) {
    console.log('[DEBUG] JWT_SECRET =', this.config.get('JWT_SECRET'))
    return this.jwt.sign({ sub: userId }, { expiresIn: ttl })
  }
}