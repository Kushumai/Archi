import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { MeController } from './me.controller'
import { MeService } from './me.service'

@Module({
  imports: [HttpModule],
  controllers: [MeController],
  providers: [MeService],
})
export class MeModule {}