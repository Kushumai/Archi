import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DocumentEntity } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentEntity)
    private readonly repo: Repository<DocumentEntity>,
  ) {}

  async findAllByOwner(ownerId: string): Promise<{ id: string; title: string; fileName: string }[]> {
    const docs = await this.repo.find({ where: { ownerId } });
    return docs.map(doc => ({
      id: doc.id,
      title: doc.title,
      fileName: doc.fileName,
    }));
  }

  async create(
    ownerId: string,
    dto: CreateDocumentDto,
    filename: string,
  ): Promise<DocumentEntity> {
    const doc = this.repo.create({
      ownerId,
      title: dto.title,
      fileName: filename,
    });
    return this.repo.save(doc);
  }

  async remove(ownerId: string, id: string): Promise<void> {
    const doc = await this.repo.findOneBy({ id, ownerId });
    if (!doc) {
      throw new NotFoundException(`Document ${id} not found for owner ${ownerId}`);
    }
    await this.repo.delete(id);
  }

  async findOneForOwner(ownerId: string, id: string): Promise<DocumentEntity | null> {
    return this.repo.findOne({ where: { id, ownerId } });
  }

  
}
