import {
  Injectable,
  ConflictException,
} from '@nestjs/common'
import { PrismaService } from '../prisma.service';
import {
  generateUniqueDiscriminator,
} from '../common/utils/discriminator.util'
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: { userId: string; firstName: string; lastName: string }) {
    const { userId, firstName, lastName } = data

    try {
      return await generateUniqueDiscriminator(async (discriminator) =>
        this.prisma.user.create({
          data: {
            userId,
            firstName,
            lastName,
            discriminator,
          },
        }),
      )
    } catch (err) {
      throw new ConflictException(
        'Impossible de créer un utilisateur avec un discriminator unique',
      )
    }
  }

  async update(id: string, data: { fullName?: string; avatarUrl?: string; bio?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}