import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MinioConfigService } from './minio.config';
import { MinioUploadInterceptor } from './minio.interceptor';

@Module({
  imports: [ConfigModule],
  providers: [MinioConfigService, MinioUploadInterceptor],
  exports: [MinioConfigService, MinioUploadInterceptor],
})
export class MinioModule {}