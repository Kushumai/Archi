import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt'; 

import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { DocumentEntity } from './entities/document.entity';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { MinioModule } from '../minio/minio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentEntity]),
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
export class DocumentsModule {}