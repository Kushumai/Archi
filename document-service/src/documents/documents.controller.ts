import {
  Controller,
  Get,
  Post,
  Delete,
  UploadedFile,
  UseInterceptors,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { minioStorage } from '../minio.config';
import { CreateDocumentDto } from './dto/create-document.dto';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { DocumentsService } from './documents.service';
import { RequestWithUser } from '../shared/types/request-with-user';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly docs: DocumentsService) {}

  @Get()
  getMyDocuments(@Req() req: RequestWithUser) {
    return this.docs.findAllByOwner(req.user.sub);
  }


  @Post()
  @UseInterceptors(
    FileInterceptor(
      'file', { storage: minioStorage }
    )
  )
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateDocumentDto,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.docs.create(req.user.sub, dto, file.filename);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    return this.docs.remove(req.user.sub, id);
  }
}