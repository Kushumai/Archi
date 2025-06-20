import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  Param,
  Res,
  Get,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { MinioUploadInterceptor } from '../minio/minio.interceptor';
import { MinioConfigService } from '../minio/minio.config';
import { ServiceAuthGuard } from '../common/guards/service-auth.guard';
import { AuthRequest } from '../common/types/auth-request.type';

@UseGuards(ServiceAuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly docs: DocumentsService,
    private readonly minio: MinioConfigService,
  ) {}

  @Post()
  @UseInterceptors(MinioUploadInterceptor)
  async create(
    @Req() req: AuthRequest,
    @Body() dto: CreateDocumentDto,
  ) {
    const file = (dto as any).file || (dto as any).buffer || (dto as any).file?.buffer;
    if (!file?.buffer) throw new Error('File is required');

    return this.docs.create(req.user.sub, dto, file);
  }

  @Get(':id/file')
  async download(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: AuthRequest,
  ) {
    const doc = await this.docs.findOneForOwner(req.user.sub, id);
    if (!doc) throw new Error('Document not found');

    const bucket = this.minio.getBucket();
    const fileName = doc.fileName;

    try {
      const stream = await this.minio.client.getObject(bucket, fileName);
      res.set({ 'Content-Disposition': `attachment; filename="${fileName}"` });
      stream.pipe(res);
    } catch (err: any) {
      console.error('❌ MinIO getObject error:', err);
      if (['NoSuchKey', 'NoSuchObject', 'NoSuchBucket'].includes(err.code)) {
        throw new Error('File not found in storage');
      }
      throw new Error('Internal server error when accessing storage');
    }
  }

  @Get('minio-files')
  async listMinioFiles(@Req() req: AuthRequest) {
    return this.docs.listMinioFiles();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Req() req: AuthRequest,
    @Param('id') id: string,
  ) {
    const doc = await this.docs.findOneForOwner(req.user.sub, id);
    if (!doc) throw new Error('Document not found');

    const bucket = this.minio.getBucket();
    const fileName = doc.fileName;

    try {
      await this.minio.client.removeObject(bucket, fileName);
    } catch (err: any) {
      console.error('⚠️ MinIO removeObject error:', err);
      if (['NoSuchKey', 'NoSuchObject', 'NoSuchBucket'].includes(err.code)) {
        console.warn(`⚠️ File ${fileName} not found in storage, skipping removeObject`);
      } else {
        throw new Error('Internal server error when accessing storage');
      }
    }

    await this.docs.remove(req.user.sub, id);
  }

  @Get('user/:id')
  async findByUserId(
    @Param('id') userId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    const parsedOffset = offset ? parseInt(offset, 10) : 0;

    return this.docs.findAllByOwner(userId, parsedLimit, parsedOffset);
  }

  @Get('me')
  async findMyDocuments(
    @Req() req: AuthRequest,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    const parsedOffset = offset ? parseInt(offset, 10) : 0;

    return this.docs.findAllByOwner(req.user.sub, parsedLimit, parsedOffset);
  }

  @Get()
  async findAllDocuments(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 100;
    const parsedOffset = offset ? parseInt(offset, 10) : 0;

    return this.docs.findAll(parsedLimit, parsedOffset);
  }
}