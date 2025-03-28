import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { UserToRoles } from './entities/user-to-roles.entity';
import { JwtModule } from '@nestjs/jwt';
import { LogModule } from '../log/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserToRoles, Role]),
    JwtModule,
    LogModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
