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
} from '@nestjs/common';
import { Response } from 'express';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { RequestWithUser } from '../shared/types/request-with-user';
import { CreateDocumentDto } from './dto/create-document.dto';
import { MinioUploadInterceptor } from '../minio/minio.interceptor';
import { MinioConfigService } from '../minio/minio.config';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(
    private readonly docs: DocumentsService,
    private readonly minio: MinioConfigService,
  ) {}

  @Post()
  @UseInterceptors(MinioUploadInterceptor)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() req: RequestWithUser,
    @Body() dto: CreateDocumentDto,
  ) {
    const file = (req as any).file;

    if (!file || !file.buffer) {
      throw new BadRequestException('File is required');
    }

    return this.docs.create(req.user.sub, dto, file);
  }

    @Get(':id/file')
    async download(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: RequestWithUser,
    ) {
    const doc = await this.docs.findOneForOwner(req.user.sub, id);
    if (!doc) throw new NotFoundException('Document not found');

    const bucket = this.minio.getBucket();
    const fileName = doc.fileName;

    try {
        const stream = await this.minio.client.getObject(bucket, fileName);

        res.set({
            'Content-Disposition': `attachment; filename="${fileName}"`,
        });

        stream.pipe(res);
    } catch (err: any) {
        console.error('❌ MinIO getObject error:', err);

        if (err.code === 'NoSuchKey' || err.code === 'NoSuchObject' || err.code === 'NoSuchBucket') {
            throw new NotFoundException('File not found in storage');
        }

        throw new Error('Internal server error when accessing storage');
    }
  }


  @Get('minio-files')
  @HttpCode(HttpStatus.OK)
  async listMinioFiles(@Req() req: RequestWithUser) {
      return this.docs.listMinioFiles();
  }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(
    @Req() req: RequestWithUser,
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

        if (err.code === 'NoSuchKey' || err.code === 'NoSuchObject' || err.code === 'NoSuchBucket') {
            console.warn(`⚠️ File ${fileName} not found in storage, skipping removeObject`);
        } else {
            throw new Error('Internal server error when accessing storage');
        }
    }
    
    await this.docs.remove(req.user.sub, id);
  }


  @Get()
  @HttpCode(HttpStatus.OK)
  async getMyDocuments(@Req() req: RequestWithUser) {
    return this.docs.findAllByOwner(req.user.sub);
  }
}
