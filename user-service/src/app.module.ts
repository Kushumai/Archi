import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './data-source';
// Plus tard : import { UserModule } from './user/user.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // TypeORM via DataSource
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...AppDataSource.options,
      }),
    }),
    UsersModule,
    // UserModule ici quand créé
  ],
})
export class AppModule {}