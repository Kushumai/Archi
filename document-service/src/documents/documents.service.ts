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
    const fileName = `${userId}/${Date.now()}-${file.originalname}`;

    await this.minio.client.putObject(
      this.minio.getBucket(),
      fileName,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype,
      }
    );


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

  async listMinioFiles(): Promise<string[]> {
    const bucket = this.minio.getBucket();
    const stream = this.minio.client.listObjectsV2(bucket, '', true);

    const fileNames: string[] = [];

    return new Promise((resolve, reject) => {
        stream.on('data', (obj) => {
            if (obj.name) {
              fileNames.push(obj.name);
            }
        });
        stream.on('end', () => {
            resolve(fileNames);
        });
        stream.on('error', (err) => {
            reject(err);
        });
    });
  }

  async remove(userId: string, documentId: string) {
    const document = await this.findOneForOwner(userId, documentId);


    await this.minio.client.removeObject(
      this.minio.getBucket(),
      document.fileName,
    );

    await this.prisma.document.delete({
      where: { id: documentId },
    });
  }
}
