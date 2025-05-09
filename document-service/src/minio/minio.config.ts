import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import * as multer from 'multer';
const multerS3Transform = require('multer-s3-transform');

@Injectable()
export class MinioConfigService {
  public s3: AWS.S3;
  public storage: multer.StorageEngine;

  constructor(private configService: ConfigService) {
    const s3 = new AWS.S3({
      endpoint: `${this.configService.get<string>('MINIO_ENDPOINT') ?? 'http://localhost'}:${this.configService.get<string>('MINIO_PORT') ?? '9000'}`,      region: this.configService.get('MINIO_REGION') ?? 'us-east-1',
      credentials: {
        accessKeyId: this.configService.get('MINIO_ACCESS_KEY')!,
        secretAccessKey: this.configService.get('MINIO_SECRET_KEY')!,
      },
      s3ForcePathStyle: true,
    });

    this.s3 = s3;

    this.storage = multerS3Transform({
      s3,
      bucket: this.configService.get('MINIO_BUCKET'),
      acl: 'private',
      contentType: (req, file, cb) => cb(null, file.mimetype),
      key: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
    });
  }
}