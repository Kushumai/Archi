import { CreateEncryptionDto } from './dto/create-encryption.dto';
import { UpdateEncryptionDto } from './dto/update-encryption.dto';
export declare class EncryptionService {
    create(createEncryptionDto: CreateEncryptionDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateEncryptionDto: UpdateEncryptionDto): string;
    remove(id: number): string;
}
