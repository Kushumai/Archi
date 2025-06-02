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

    const fileName = doc.fileName;

    try {
      const stream = await this.minio.client.getObject(
        this.minio.getBucket(),
        fileName,
      );

      res.set({
        'Content-Disposition': `attachment; filename="${fileName}"`,
      });

      stream.pipe(res);
    } catch (err) {
      console.error('❌ Erreur MinIO :', err);
      throw new NotFoundException('Fichier introuvable dans MinIO');
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    const doc = await this.docs.findOneForOwner(req.user.sub, id);
    if (!doc) throw new NotFoundException('Document not found');

    try {
      await this.minio.client.removeObject(
        this.minio.getBucket(),
        doc.fileName,
      );
    } catch (err) {
      console.error('⚠️ Erreur suppression MinIO (continuation suppression base) :', err);
    }

    await this.docs.remove(req.user.sub, id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getMyDocuments(@Req() req: RequestWithUser) {
    return this.docs.findAllByOwner(req.user.sub);
  }
}
