import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll() {
    return this.prisma.profile.findMany();
  }

  async findById(id: string) {
    return this.prisma.profile.findUnique({
      where: { id },
    });
  }

  async create(data: { userId: string; fullName: string; avatarUrl?: string; bio?: string }) {
    return this.prisma.profile.create({
      data,
    });
  }

  async update(id: string, data: { fullName?: string; avatarUrl?: string; bio?: string }) {
    return this.prisma.profile.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.profile.delete({
      where: { id },
    });
  }
}