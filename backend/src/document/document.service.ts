import { Injectable, NotFoundException, Logger} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentEntity } from './schemas/document.schema';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel(DocumentEntity.name) private documentModel: Model<DocumentEntity>,
  ) {}

  async create(createDto: CreateDocumentDto): Promise<DocumentEntity> {
    const createdDocument = new this.documentModel(createDto);
    return createdDocument.save();
  }

  async findAll(): Promise<DocumentEntity[]> {
    return this.documentModel.find().exec();
  }

  async findOne(id: string): Promise<DocumentEntity> {
    const document = await this.documentModel.findById(id).exec();
    if (!document) {
      throw new Error(`Document with ID ${id} not found`);
    }
    return document;
  }

  async update(id: string, updateDto: UpdateDocumentDto): Promise<DocumentEntity> {
    const updatedDocument = await this.documentModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
  
    if (!updatedDocument) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
  
    return updatedDocument as DocumentEntity;
  }  


  async remove(id: string): Promise<DocumentEntity> {
    const deletedDocument = await this.documentModel.findByIdAndDelete(id).exec();
  
    if (!deletedDocument) {
      Logger.error(`Attempted to delete a non-existent document with ID ${id}`);
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
  
    return deletedDocument as DocumentEntity;
  }
}
