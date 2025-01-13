import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const mockUserRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find a user by email', async () => {
    const email = 'test@example.com';
    const user = { id: 1, email, password: 'hashedPassword' } as User;
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

    const result = await service.findByEmail(email);
    expect(result).toEqual(user);
    expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email } });
  });

  it('should hash a password', async () => {
    const password = 'plainTextPassword';
    const hashedPassword = await service.hashPassword(password);
    expect(await service.comparePasswords(password, hashedPassword)).toBe(true);
  });
});
