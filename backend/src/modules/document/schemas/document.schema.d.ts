import { Document as MongooseDocument } from 'mongoose';
export declare class DocumentEntity {
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}
export type DocumentModel = DocumentEntity & MongooseDocument;
export declare const DocumentSchema: import("mongoose").Schema<DocumentEntity, import("mongoose").Model<DocumentEntity, any, any, any, MongooseDocument<unknown, any, DocumentEntity> & DocumentEntity & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DocumentEntity, MongooseDocument<unknown, {}, import("mongoose").FlatRecord<DocumentEntity>> & import("mongoose").FlatRecord<DocumentEntity> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
