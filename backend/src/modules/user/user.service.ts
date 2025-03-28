import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateUserDto } from './dto/register.dto';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { UserToRoles } from './entities/user-to-roles.entity';
import * as bcrypt from 'bcryptjs';
import { LoggerService } from '../log/logger.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    @InjectRepository(UserToRoles)
    private readonly userToRolesRepository: Repository<UserToRoles>,

    private readonly logger: LoggerService,
  ) {}






  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password, roles} = createUserDto;

    this.logger.log(`Tentative de création de l'utilisateur : ${username}`);

    // Check if username already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
    if (existingUser) {
      this.logger.error(`Échec de la création : username ou email existant (${username}, ${email})`);
      throw new ConflictException('Username or email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Roles by Id 

    const roleEntities = await this.roleRepository.findBy({ id: In(roles) });
    if (roleEntities.length !== roles.length) {
      this.logger.error(`Échec de la création pour ${username} : rôle(s) invalide(s)`);
      throw new NotFoundException('One or more roles are invalid');
    }


    // Create the new user
    const newUser = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(newUser);

    const userToRoles = roleEntities.map((role) =>
      this.userToRolesRepository.create({ user: savedUser, role }),
    );
    await this.userToRolesRepository.save(userToRoles);

    this.logger.log(`Utilisateur créé avec succès : ${username} (ID: ${savedUser.id})`);
    return savedUser;
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    this.logger.log(`Validation de l'utilisateur : ${username}`);
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['userToRoles', 'userToRoles.role'],
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      this.logger.error(`Tentative de connexion échouée pour : ${username}`);
      throw new UnauthorizedException('Invalid username or password');
    }
    this.logger.log(`Utilisateur validé : ${username}`);
    return user;
  }

  async findAll(): Promise<User[]> {
    this.logger.log('Récupération de tous les utilisateurs');
    return this.userRepository.find({ relations: ['userToRoles', 'userToRoles.role'] });
  }

  async findOne(id: number): Promise<User> {
    this.logger.log(`Récupération de l'utilisateur avec l'ID : ${id}`);
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['userToRoles', 'userToRoles.role'],
    });
    if (!user) {
      this.logger.error(`Utilisateur non trouvé avec l'ID : ${id}`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: Partial<CreateUserDto>): Promise<User> {
    this.logger.log(`Mise à jour de l'utilisateur avec l'ID : ${id}`);
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);

    this.logger.log(`Utilisateur mis à jour avec succès : ${updatedUser.username} (ID: ${updatedUser.id})`);
    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`Suppression de l'utilisateur avec l'ID : ${id}`);
    const user = await this.findOne(id);
    await this.userRepository.delete(user.id);
    this.logger.log(`Utilisateur supprimé avec succès : ${user.username} (ID: ${user.id})`);
  }
}