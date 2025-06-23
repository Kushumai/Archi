// document-service/src/documents/documents.controller.ts

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
  UploadedFile,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { MinioUploadInterceptor } from '../minio/minio.interceptor';
import { MinioConfigService } from '../minio/minio.config';
import { ServiceAuthGuard } from '../common/guards/service-auth.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthRequest } from '../common/types/auth-request.type';

@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly docs: DocumentsService,
    private readonly minio: MinioConfigService,
  ) {}

  // -------------------
  // Admin / service-to-service (service-token)
  // -------------------

  @UseGuards(ServiceAuthGuard)
  @Post()
  @UseInterceptors(MinioUploadInterceptor)
  async create(
    @Req() req: AuthRequest,
    @Body() dto: CreateDocumentDto,
  ) {
    const file = (dto as any).file || (dto as any).buffer || (dto as any).file?.buffer;
    if (!file?.buffer) {
      throw new Error('File is required');
    }
    return this.docs.create(req.user.sub, dto, file);
  }

  @UseGuards(ServiceAuthGuard)
  @Get()
  async findAllDocuments(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 100;
    const parsedOffset = offset ? parseInt(offset, 10) : 0;
    return this.docs.findAll(parsedLimit, parsedOffset);
  }

  @UseGuards(ServiceAuthGuard)
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

  @UseGuards(ServiceAuthGuard)
  @Get(':id/file')
  async download(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: AuthRequest,
  ) {
    const doc = await this.docs.findOneForOwner(req.user.sub, id);
    if (!doc) {
      throw new Error('Document not found');
    }
    const bucket = this.minio.getBucket();
    const stream = await this.minio.client.getObject(bucket, doc.fileName);
    res.set({ 'Content-Disposition': `attachment; filename="${doc.fileName}"` });
    return stream.pipe(res);
  }

  @UseGuards(ServiceAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Req() req: AuthRequest,
    @Param('id') id: string,
  ) {
    const doc = await this.docs.findOneForOwner(req.user.sub, id);
    if (!doc) {
      throw new Error('Document not found');
    }
    const bucket = this.minio.getBucket();
    try {
      await this.minio.client.removeObject(bucket, doc.fileName);
    } catch {
    }
    await this.docs.remove(req.user.sub, id);
  }

  // -------------------
  // User-specific (JWT user-token)
  // -------------------

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Post('me')
  @UseInterceptors(MinioUploadInterceptor)
  async uploadMyDocuments(
    @Req() req: AuthRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // On n’utilise plus CreateDocumentDto ici
    // Si besoin, titre/description viendront plus tard via d’autres champs @Body()
    return this.docs.create(req.user.sub, { title: '', description: '' }, file);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('me/:id/file')
  async downloadMyDocument(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: AuthRequest,
  ) {
    // On vérifie bien que l’utilisateur est owner via JwtAuthGuard + req.user.sub
    const doc = await this.docs.findOneForOwner(req.user.sub, id);
    if (!doc) throw new NotFoundException('Document not found');
    const bucket = this.minio.getBucket();
    const stream = await this.minio.client.getObject(bucket, doc.fileName);
    res.set({ 'Content-Disposition': `attachment; filename="${doc.fileName}"` });
    return stream.pipe(res);
  }
}
