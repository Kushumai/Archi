"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const document_schema_1 = require("./schemas/document.schema");
let DocumentService = class DocumentService {
    constructor(documentModel) {
        this.documentModel = documentModel;
    }
    async create(createDto) {
        const createdDocument = new this.documentModel(createDto);
        return createdDocument.save();
    }
    async findAll() {
        return this.documentModel.find().exec();
    }
    async findOne(id) {
        const document = await this.documentModel.findById(id).exec();
        if (!document) {
            throw new Error(`Document with ID ${id} not found`);
        }
        return document;
    }
    async update(id, updateDto) {
        const updatedDocument = await this.documentModel
            .findByIdAndUpdate(id, updateDto, { new: true })
            .exec();
        if (!updatedDocument) {
            throw new common_1.NotFoundException(`Document with ID ${id} not found`);
        }
        return updatedDocument;
    }
    async remove(id) {
        const deletedDocument = await this.documentModel.findByIdAndDelete(id).exec();
        if (!deletedDocument) {
            common_1.Logger.error(`Attempted to delete a non-existent document with ID ${id}`);
            throw new common_1.NotFoundException(`Document with ID ${id} not found`);
        }
        return deletedDocument;
    }
};
exports.DocumentService = DocumentService;
exports.DocumentService = DocumentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(document_schema_1.DocumentEntity.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DocumentService);
//# sourceMappingURL=document.service.js.map