

import { 
  Controller, Get, Post, Delete, UploadedFile, UseInterceptors,
  Body, Req, HttpCode, HttpStatus, Param, UseGuards 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateDocumentDto } from './dto/create-document.dto';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { DocumentsService } from './documents.service';
import { RequestWithUser } from '../shared/types/request-with-user';


@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly docs: DocumentsService) {}

  @Get()
  async getMyDocuments(@Req() req: RequestWithUser) {
    return this.docs.findAllByOwner(req.user.sub);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() req: RequestWithUser,
    @Body() dto: CreateDocumentDto,
  ) {
    return this.docs.create(req.user.sub, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
  ) {
    await this.docs.remove(req.user.sub, id);
  }
}