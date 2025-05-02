import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
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

  findAllByOwner(ownerId: string) {
    return this.repo.find({ where: { ownerId } });
  }

  async create(ownerId: string, dto: CreateDocumentDto) {
    const doc = this.repo.create({ ...dto, ownerId });
    return this.repo.save(doc);
  }

  async remove(ownerId: string, id: string): Promise<void> {
    const doc = await this.repo.findOneBy({ id, ownerId });
    if (!doc) {
      throw new NotFoundException(`Document ${id} not found for owner ${ownerId}`);
    }
    await this.repo.delete(id);
  }
}