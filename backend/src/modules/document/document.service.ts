import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { GridFSBucket, GridFSFile, ObjectId } from 'mongodb';
import { Readable } from 'stream';

import { DocumentEntity } from './schemas/document.schema';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { LoggerService } from '../log/logger.service';

@Injectable()
export class DocumentService implements OnModuleInit {
  private bucket!: GridFSBucket;

  constructor(
    @InjectModel(DocumentEntity.name)
    private documentModel: Model<DocumentEntity>,
    private readonly logger: LoggerService,

    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async onModuleInit() {
    if (!this.connection.db) {
      throw new Error('MongoDB connection is not ready');
    }
    this.bucket = new GridFSBucket(this.connection.db as any, {
      bucketName: 'documents',
    });
    console.log('✅ GridFSBucket initialized');
  }

  async uploadDocument(file: Express.Multer.File, title: string): Promise<any> {
    if (!this.bucket) {
      console.error('GridFS is not initialized yet');
      throw new Error('GridFS is not initialized yet.');
    }
  
    const readableStream = Readable.from(file.buffer);
  
    const uploadStream = this.bucket.openUploadStream(title, {
      metadata: { originalname: file.originalname },
    });
  
    readableStream.pipe(uploadStream);
  
    return new Promise((resolve, reject) => {
      uploadStream.on('finish', (uploadedFile: any) => {
        console.log('Fichier uploadé avec succès dans GridFS');
        resolve(uploadedFile);
      });
  
      uploadStream.on('error', (err: Error) => {
        console.error('Erreur lors de l\'upload dans GridFS:', err);
        reject(err);
      });
    });
  }
  
  async listGridFsFiles(): Promise<GridFSFile[]> {
    const files: GridFSFile[] = [];
    const cursor = this.bucket.find();
  
    for await (const file of cursor) {
      files.push(file);
    }
  
    return files;
  }

  async create(createDto: CreateDocumentDto): Promise<DocumentEntity> {
    this.logger.log(`📄 Création d'un nouveau document`);
    const createdDocument = new this.documentModel(createDto);
    return createdDocument.save();
  }

  async findAll(): Promise<DocumentEntity[]> {
    this.logger.log(`📂 Récupération de tous les documents`);
    return this.documentModel.find().exec();
  }

  async findOne(id: string): Promise<DocumentEntity> {
    this.logger.log(`🔍 Recherche du document avec ID: ${id}`);
    const document = await this.documentModel.findById(id).exec();
    if (!document) {
      this.logger.error(`❌ Document non trouvé avec l'ID: ${id}`);
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return document;
  }

  async update(id: string, updateDto: UpdateDocumentDto): Promise<DocumentEntity> {
    this.logger.log(`✏️ Mise à jour du document avec ID: ${id}`);
    const updatedDocument = await this.documentModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();

    if (!updatedDocument) {
      this.logger.error(`❌ Échec de mise à jour : Document non trouvé avec l'ID: ${id}`);
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return updatedDocument as DocumentEntity;
  }

  async remove(id: string): Promise<DocumentEntity> {
    this.logger.log(`🗑️ Suppression du document avec ID: ${id}`);
    const deletedDocument = await this.documentModel.findByIdAndDelete(id).exec();

    if (!deletedDocument) {
      this.logger.error(`❌ Tentative de suppression d'un document inexistant avec l'ID: ${id}`);
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return deletedDocument as DocumentEntity;
  }
}