import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma.service';
import { ServiceAuthGuard } from '../common/guards/service-auth.guard'

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({})
  ],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, ServiceAuthGuard],
})
export class UsersModule { }