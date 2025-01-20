import { Model } from 'mongoose';
import { DocumentEntity } from './schemas/document.schema';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
export declare class DocumentService {
    private documentModel;
    constructor(documentModel: Model<DocumentEntity>);
    create(createDto: CreateDocumentDto): Promise<DocumentEntity>;
    findAll(): Promise<DocumentEntity[]>;
    findOne(id: string): Promise<DocumentEntity>;
    update(id: string, updateDto: UpdateDocumentDto): Promise<DocumentEntity>;
    remove(id: string): Promise<DocumentEntity>;
}
