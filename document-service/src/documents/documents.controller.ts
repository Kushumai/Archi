import {
  Controller,
  Post,
  Req,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { RequestWithUser } from '../shared/types/request-with-user';
import { CreateDocumentDto } from './dto/create-document.dto';
import { MinioUploadInterceptor } from '../minio/minio.interceptor';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(
    private readonly docs: DocumentsService,
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
}