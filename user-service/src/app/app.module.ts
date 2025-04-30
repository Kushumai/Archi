import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from './data-source'; // on utilisera cette instance
// Plus tard : import { UserModule } from './user/user.module';

@Module({
  imports: [
    // TypeORM via DataSource
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...DataSource.options,
      }),
    }),
    // UserModule ici quand créé
  ],
})
export class AppModule {}