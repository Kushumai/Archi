import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { MinioConfigService } from '../minio/minio.config';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly minio: MinioConfigService,
  ) { }

  async create(userId: string, dto: CreateDocumentDto, file: Express.Multer.File) {
    const fileName = `${Date.now()}-${file.originalname}`;

    // Upload dans MinIO
    await this.minio.client.putObject(
      this.minio.getBucket(),
      fileName,
      file.buffer,
      file.size,  // size en bytes (number)
      {
        'Content-Type': file.mimetype,
      }
    );


    // Enregistrer en BDD
    const document = await this.prisma.document.create({
      data: {
        title: dto.title,
        description: dto.description,
        fileName,
        ownerId: userId,
      },
    });

    return document;
  }

  async findAllByOwner(userId: string) {
    return this.prisma.document.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneForOwner(userId: string, documentId: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document || document.ownerId !== userId) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async remove(userId: string, documentId: string) {
    const document = await this.findOneForOwner(userId, documentId);

    // Supprimer dans MinIO
    await this.minio.client.removeObject(
      this.minio.getBucket(),
      document.fileName,
    );

    // Supprimer dans la BDD
    await this.prisma.document.delete({
      where: { id: documentId },
    });
  }
}
