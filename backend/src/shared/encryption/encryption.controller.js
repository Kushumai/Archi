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
exports.EncryptionController = void 0;
const common_1 = require("@nestjs/common");
const encryption_service_1 = require("./encryption.service");
const create_encryption_dto_1 = require("./dto/create-encryption.dto");
const update_encryption_dto_1 = require("./dto/update-encryption.dto");
let EncryptionController = class EncryptionController {
    constructor(encryptionService) {
        this.encryptionService = encryptionService;
    }
    create(createEncryptionDto) {
        return this.encryptionService.create(createEncryptionDto);
    }
    findAll() {
        return this.encryptionService.findAll();
    }
    findOne(id) {
        return this.encryptionService.findOne(+id);
    }
    update(id, updateEncryptionDto) {
        return this.encryptionService.update(+id, updateEncryptionDto);
    }
    remove(id) {
        return this.encryptionService.remove(+id);
    }
};
exports.EncryptionController = EncryptionController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_encryption_dto_1.CreateEncryptionDto]),
    __metadata("design:returntype", void 0)
], EncryptionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EncryptionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EncryptionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_encryption_dto_1.UpdateEncryptionDto]),
    __metadata("design:returntype", void 0)
], EncryptionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EncryptionController.prototype, "remove", null);
exports.EncryptionController = EncryptionController = __decorate([
    (0, common_1.Controller)('encryption'),
    __metadata("design:paramtypes", [encryption_service_1.EncryptionService])
], EncryptionController);
//# sourceMappingURL=encryption.controller.js.map