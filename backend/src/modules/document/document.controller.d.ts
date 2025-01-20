import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
export declare class DocumentController {
    private readonly documentService;
    constructor(documentService: DocumentService);
    create(createDocumentDto: CreateDocumentDto): Promise<import("./schemas/document.schema").DocumentEntity>;
    findAll(): Promise<import("./schemas/document.schema").DocumentEntity[]>;
    findOne(id: string): Promise<import("./schemas/document.schema").DocumentEntity>;
    update(id: string, updateDocumentDto: UpdateDocumentDto): Promise<import("./schemas/document.schema").DocumentEntity>;
    remove(id: string): Promise<import("./schemas/document.schema").DocumentEntity>;
}
