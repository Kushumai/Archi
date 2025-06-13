declare module 'multer-s3-transform' {
    import { StorageEngine } from 'multer';
    import type { S3ClientConfig, S3Client } from '@aws-sdk/client-s3';
    
    interface MulterS3TransformOptions {
      s3: S3Client;
      bucket: string;
      acl?: string;
      contentType?: any;
      metadata?: (req: any, file: Express.Multer.File, cb: (err: any, metadata?: Record<string, any>) => void) => void;
      key: (req: any, file: Express.Multer.File, cb: (err: any, key?: string) => void) => void;
      shouldTransform?: (req: any, file: Express.Multer.File, cb: (err: any, transform?: boolean) => void) => void;
      transforms?: Array<{
        id: string;
        key?: (req: any, filename: string) => Promise<string>;
        transform: (req: any, file: Express.Multer.File) => NodeJS.ReadWriteStream;
      }>;
    }
    function multerS3Transform(opts: MulterS3TransformOptions): StorageEngine;

    namespace multerS3Transform {
      const AUTO_CONTENT_TYPE: any;
    }
    
    export function multerS3Transform(opts: MulterS3TransformOptions): StorageEngine & { AUTO_CONTENT_TYPE: any };
  }
  