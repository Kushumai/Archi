// document-service/src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { DocumentsModule } from './documents/documents.module';
import { DocumentEntity } from './documents/entities/document.entity';
import { MinioConfigService } from './minio/minio.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),    // pour process.env
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [DocumentEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([DocumentEntity]),
    DocumentsModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [MinioConfigService],
  exports: [MinioConfigService],
})
export class AppModule {}