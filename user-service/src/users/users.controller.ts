import { Controller, Get, Post, Put, Delete, Param, Body, Req, UseGuards, UnauthorizedException, NotFoundException, InternalServerErrorException } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { ServiceAuthGuard } from '../common/guards/service-auth.guard'
import { Prisma } from '@prisma/client';

@UseGuards(ServiceAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Req() req: any) {
    const userId = req.user?.sub
    if (!userId) throw new UnauthorizedException('User ID not found in token')
    return this.usersService.findById(userId)
  }

  @Get()
  async findAll() {
    return this.usersService.findAll()
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id)
  }

  @Get('by-user-id/:userId')
  async findByUserId(@Param('userId') userId: string) {
    return this.usersService.findByUserId(userId);
  }

  @Post()
  async create(@Body() body: CreateUserDto) {
      console.log("[USER] Création utilisateur reçue", body);
    return this.usersService.create(body)
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.usersService.update(id, body)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      return await this.usersService.delete(id)
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
        throw new NotFoundException('Utilisateur déjà supprimé ou inexistant');
      }
      console.error("[USER-SERVICE] Erreur suppression user", err);
      throw err;
    }
  }
}