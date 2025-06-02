import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { PrismaService } from '../prisma/prisma.service';
import { DocumentsModule } from './documents/documents.module';
import { MinioConfigService } from './minio/minio.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DocumentsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [PrismaService, MinioConfigService],
  exports: [PrismaService, MinioConfigService],
})
export class AppModule { }
