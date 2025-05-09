import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { MinioConfigService } from './minio.config';
  import { from, Observable } from 'rxjs';
  
  @Injectable()
  export class MinioUploadInterceptor implements NestInterceptor {
    private readonly instance: NestInterceptor;
  
    constructor(minio: MinioConfigService) {
      const InterceptorClass = FileInterceptor('file', {
        storage: minio.storage,
      });
      this.instance = new InterceptorClass();
    }
  
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        await (this.instance.intercept(context, next) as Promise<any>);
        return next.handle();
    }
  }