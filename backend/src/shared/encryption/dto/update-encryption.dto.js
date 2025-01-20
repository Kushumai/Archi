"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEncryptionDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_encryption_dto_1 = require("./create-encryption.dto");
class UpdateEncryptionDto extends (0, mapped_types_1.PartialType)(create_encryption_dto_1.CreateEncryptionDto) {
}
exports.UpdateEncryptionDto = UpdateEncryptionDto;
//# sourceMappingURL=update-encryption.dto.js.map