import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MinioModule } from '../minio/minio.module';
import { PrismaModule } from '../../prisma/prisma.module';
@Module({
  imports: [
    PrismaModule,
    MinioModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY!,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    DocumentsService,
    JwtAuthGuard,
  ],
  controllers: [DocumentsController],
})
export class DocumentsModule { }
