import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'

import { MeController } from './me.controller'
import { MeService } from './me.service'

@Module({
  imports: [HttpModule, JwtModule.register({}), ConfigModule],
  controllers: [MeController],
  providers: [MeService],
})
export class MeModule {}