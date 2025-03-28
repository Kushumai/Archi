import { Controller, Get, Post, Body, Param, Patch, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Public } from '/shared/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  @Public()
  create(@Body() createDocumentDto: CreateDocumentDto) {
    return this.documentService.create(createDocumentDto);
  }

  @Post('upload')
  @Public()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
  ) {
    console.log('📨 Requête POST /api/document/upload reçue');
    return this.documentService.uploadDocument(file, title);
  }

  @Get('files')
  @Public()
  async listFiles() {
  return this.documentService.listGridFsFiles();
  }

  @Get()
  @Public()
  findAll() {
    return this.documentService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.documentService.findOne(id);
  }
  
  @Patch(':id')
  @Public()
  update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentService.update(id, updateDocumentDto);
  }

  @Delete(':id')
  @Public()
  remove(@Param('id') id: string) {
    return this.documentService.remove(id);
  }
}
