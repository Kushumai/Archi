// document-service/src/documents/documents.controller.ts

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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, DiskStorageOptions } from 'multer';
import { CreateDocumentDto } from './dto/create-document.dto';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { DocumentsService } from './documents.service';
import { RequestWithUser } from '../shared/types/request-with-user';

const storageOpts: DiskStorageOptions = {
  destination: './uploads',
  filename: (_req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${Date.now()}.${ext}`);
  },
};

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly docs: DocumentsService) {}

  @Get()
  getMyDocuments(@Req() req: RequestWithUser) {
    return this.docs.findAllByOwner(req.user.sub);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage(storageOpts),
  }))
  @HttpCode(HttpStatus.CREATED)
  create(
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateDocumentDto,
  ) {
    // on transmet **uniquement** file.filename (string)
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