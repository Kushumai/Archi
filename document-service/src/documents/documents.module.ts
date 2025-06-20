import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { ServiceAuthGuard } from '../common/guards/service-auth.guard';
import { MinioModule } from '../minio/minio.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    MinioModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY!,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    DocumentsService,
    ServiceAuthGuard,
  ],
  controllers: [DocumentsController],
})
export class DocumentsModule {}