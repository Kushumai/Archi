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
  
    if (!file || !file.key) {
      throw new BadRequestException('File is required');
    }
  
    return this.docs.create(req.user.sub, dto, file.key ?? file.originalname);
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
      const object = await this.minio.s3
        .getObject({
          Bucket: this.minio.getBucket(),
          Key: fileName,
        })
        .promise();
    
      res.set({
        'Content-Type': object.ContentType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      });
    
      const stream = object.Body;
    
      if (stream && typeof (stream as any).pipe === 'function') {
        (stream as any).pipe(res);
      } else {
        res.send(stream); // fallback buffer
      }
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
      await this.minio.s3.deleteObject({
        Bucket: this.minio.getBucket(),
        Key: doc.fileName,
      }).promise();
    } catch (err) {
      console.error('⚠️ Erreur suppression MinIO (continuation suppression base) :', err);
    }

    await this.docs.remove(req.user.sub, id);
  }

}