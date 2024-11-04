import { Injectable } from '@nestjs/common';
import { CreateEncryptionDto } from './dto/create-encryption.dto';
import { UpdateEncryptionDto } from './dto/update-encryption.dto';

@Injectable()
export class EncryptionService {
  create(createEncryptionDto: CreateEncryptionDto) {
    return 'This action adds a new encryption';
  }

  findAll() {
    return `This action returns all encryption`;
  }

  findOne(id: number) {
    return `This action returns a #${id} encryption`;
  }

  update(id: number, updateEncryptionDto: UpdateEncryptionDto) {
    return `This action updates a #${id} encryption`;
  }

  remove(id: number) {
    return `This action removes a #${id} encryption`;
  }
}
