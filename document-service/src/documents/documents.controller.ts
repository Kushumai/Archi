import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Req,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { RequestWithUser } from '../shared/types/request-with-user';
import { CreateDocumentDto } from './dto/create-document.dto';
import { MinioConfigService } from '../minio/minio.config';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(
    private readonly docs: DocumentsService,
    private readonly minio: MinioConfigService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
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

  useFileInterceptor() {
    return FileInterceptor('file', { storage: this.minio.storage });
  }
}