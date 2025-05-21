import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }