import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { ServiceAuthGuard } from '../common/guards/service-auth.guard';
import { MinioModule } from '../minio/minio.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../common/auth.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    MinioModule,
    AuthModule,
  ],
  providers: [
    DocumentsService,
    ServiceAuthGuard,
  ],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
