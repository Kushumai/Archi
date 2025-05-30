import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) { }

  async findAllByOwner(ownerId: string): Promise<{ id: string; title: string; fileName: string }[]> {
    const docs = await this.prisma.document.findMany({
      where: { ownerId },
    });

    return docs.map(doc => ({
      id: doc.id,
      title: doc.title,
      fileName: doc.fileName,
    }));
  }

  async create(ownerId: string, dto: CreateDocumentDto, filename: string) {
    return this.prisma.document.create({
      data: {
        ownerId,
        title: dto.title,
        fileName: filename,
      },
    });
  }

  async remove(ownerId: string, id: string): Promise<void> {
    const doc = await this.prisma.document.findFirst({
      where: { id, ownerId },
    });

    if (!doc) {
      throw new NotFoundException(`Document ${id} not found for owner ${ownerId}`);
    }

    await this.prisma.document.delete({
      where: { id },
    });
  }

  async findOneForOwner(ownerId: string, id: string) {
    return this.prisma.document.findFirst({
      where: { id, ownerId },
    });
  }
}
