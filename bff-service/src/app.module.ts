import { Module } from '@nestjs/common';
import { MeModule } from './modules/me/me.module'
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({}),
    MeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}