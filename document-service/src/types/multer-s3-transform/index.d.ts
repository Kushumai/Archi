// document-service/src/@types/multer-s3-transform/index.d.ts
declare module 'multer-s3-transform' {
    import { StorageEngine } from 'multer';
    import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
  
    export interface MulterS3TransformOptions {
      s3: S3Client;
      bucket: string;
      acl?: string;
      contentType?: any;
      key: (req: Express.Request, file: Express.Multer.File, cb: (err: Error | null, key?: string) => void) => void;
      shouldTransform?: (req: Express.Request, file: Express.Multer.File, cb: (err: Error | null, transform?: boolean) => void) => void;
      transforms?: any[];
    }
  
    function multerS3Transform(opts: MulterS3TransformOptions): StorageEngine;
  
    namespace multerS3Transform {
      const AUTO_CONTENT_TYPE: any;
    }
  
    export { multerS3Transform };
  }  