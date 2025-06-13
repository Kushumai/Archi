import {
  Controller,
  Post,
  Req,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  BadRequestException,
  UseInterceptors,
  Param,
  Res,
  NotFoundException,
  Get,
  Delete,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthRequest } from '../common/types/auth-request.type';
import { CreateDocumentDto } from './dto/create-document.dto';
import { MinioUploadInterceptor } from '../minio/minio.interceptor';
import { MinioConfigService } from '../minio/minio.config';

@UseGuards(JwtAuthGuard)
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
    const file = (req as any).file;
    if (!file?.buffer) throw new BadRequestException('File is required');

    return this.docs.create(req.user.sub, dto, file);
  }

  @Get(':id/file')
  async download(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: AuthRequest,
  ) {
    const doc = await this.docs.findOneForOwner(req.user.sub, id);
    if (!doc) throw new NotFoundException('Document not found');

    const bucket = this.minio.getBucket();
    const fileName = doc.fileName;

    try {
      const stream = await this.minio.client.getObject(bucket, fileName);
      res.set({ 'Content-Disposition': `attachment; filename="${fileName}"` });
      stream.pipe(res);
    } catch (err: any) {
      console.error('❌ MinIO getObject error:', err);
      if (['NoSuchKey', 'NoSuchObject', 'NoSuchBucket'].includes(err.code)) {
        throw new NotFoundException('File not found in storage');
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
    if (!doc) throw new NotFoundException('Document not found');

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

  @Get()
  async getMyDocuments(
    @Req() req: AuthRequest,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    const parsedOffset = offset ? parseInt(offset, 10) : 0;

    return this.docs.findAllByOwner(req.user.sub, parsedLimit, parsedOffset);
  }
}