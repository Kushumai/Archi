import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { DocumentsModule } from './documents/documents.module';
import { DocumentEntity } from './documents/entities/document.entity';

@Module({
  imports: [
    // 1) Charge automatiquement .env
    ConfigModule.forRoot({ isGlobal: true }),

    // 2) Connexion à la base via ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [DocumentEntity],
        synchronize: true,
      }),
    }),

    // 3) Module TypeORM pour l’entity
    TypeOrmModule.forFeature([DocumentEntity]),

    // 4) Module fonctionnel
    DocumentsModule,

    // 5) JWT
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('SECRET_KEY'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
})
export class AppModule {}