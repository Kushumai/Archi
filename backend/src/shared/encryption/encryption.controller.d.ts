import { EncryptionService } from './encryption.service';
import { CreateEncryptionDto } from './dto/create-encryption.dto';
import { UpdateEncryptionDto } from './dto/update-encryption.dto';
export declare class EncryptionController {
    private readonly encryptionService;
    constructor(encryptionService: EncryptionService);
    create(createEncryptionDto: CreateEncryptionDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateEncryptionDto: UpdateEncryptionDto): string;
    remove(id: string): string;
}
