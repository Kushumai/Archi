import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { DocumentsService } from './documents.service';
import { RequestWithUser } from '../shared/types/request-with-user';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly docs: DocumentsService) {
    console.log('🗂️  DocumentsController instantiated');
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyDocuments(@Req() req: RequestWithUser) {
    // req.user.sub est l'ID depuis votre JWT
    return this.docs.findAllByOwner(req.user.sub);
  }
}