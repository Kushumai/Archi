import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DocumentService } from './document.service';

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get('me')
  async findMyDocuments(
    @Req() req: Request,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.documentService.findMyDocuments(req, limit, offset);
  }

  @Get('user/:id')
  async findByUserId(
    @Param('id') userId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.documentService.findByUserId(userId, limit, offset);
  }

  @Get()
  async findAllDocuments(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.documentService.findAll(limit, offset);
  }

  @Post()
  async create(@Req() req: Request, @Body() body: any) {
    return this.documentService.create(req, body);
  }

  @Get(':id/file')
  async download(
    @Req() req: Request,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    return this.documentService.download(req, id, res);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Req() req: Request, @Param('id') id: string) {
    return this.documentService.remove(req, id);
  }
}