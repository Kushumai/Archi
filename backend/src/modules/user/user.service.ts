import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { UserToRoles } from './entities/user-to-roles.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    @InjectRepository(UserToRoles)
    private readonly userToRolesRepository: Repository<UserToRoles>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password, roles} = createUserDto;

    // Check if username already exists
    const existingUser = await this.userRepository.findOne({ where: [{ username }, { email }] });
    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Roles by Id 

    const roleEntities = await this.roleRepository.findBy({ id: In(roles) });
    if (roleEntities.length !== roles.length) {
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

    // Save the user and return it
    return savedUser;
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { username }, relations: ['userToRoles', 'userToRoles.role'] });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid username or password');
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['userToRoles', 'userToRoles.role'] });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['userToRoles', 'userToRoles.role'] });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: Partial<CreateUserDto>): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);

    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.delete(user.id);
  }
}