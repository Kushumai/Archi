import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';

@Module({
  imports: [HttpModule, JwtModule.register({}), ConfigModule],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}