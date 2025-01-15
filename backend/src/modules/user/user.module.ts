import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Pour gérer les entités User via TypeORM
    JwtModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Exporte UserService si d'autres modules en ont besoin
})
export class UserModule {}
