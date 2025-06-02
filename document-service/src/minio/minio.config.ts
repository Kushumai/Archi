import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioConfigService {
  public client: Minio.Client;

  constructor(private configService: ConfigService) {
    this.client = new Minio.Client({
      endPoint: this.configService.get<string>('MINIO_ENDPOINT') ?? 'localhost',
      port: parseInt(this.configService.get<string>('MINIO_PORT') ?? '9000', 10),
      useSSL: false,
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY')!,
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY')!,
    });
  }

  getBucket(): string {
    return this.configService.get<string>('MINIO_BUCKET')!;
  }
}
