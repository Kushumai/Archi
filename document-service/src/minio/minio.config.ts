// document-service/src/minio/minio.config.ts

import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioConfigService implements OnModuleInit {
  private readonly logger = new Logger(MinioConfigService.name);
  public client: Minio.Client;
  private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get<string>('MINIO_BUCKET')!;
    this.client = new Minio.Client({
      endPoint: this.configService.get<string>('MINIO_ENDPOINT') ?? 'localhost',
      port: parseInt(this.configService.get<string>('MINIO_PORT') ?? '9000', 10),
      useSSL: this.configService.get<boolean>('MINIO_USE_SSL') ?? false,
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY')!,
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY')!,
    });
  }

  async onModuleInit() {
    try {
      const exists = await this.client.bucketExists(this.bucketName);
      if (!exists) {
        await this.client.makeBucket(this.bucketName, '');
        this.logger.log(`MinIO bucket "${this.bucketName}" created.`);
      } else {
        this.logger.log(`MinIO bucket "${this.bucketName}" already exists.`);
      }
    } catch (err) {
      this.logger.error(`Error ensuring MinIO bucket exists: ${err}`);
      throw err;
    }
  }

  getBucket(): string {
    return this.bucketName;
  }
}