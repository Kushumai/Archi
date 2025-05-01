// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { DocumentsModule } from './documents/documents.module';
import { DocumentEntity } from './documents/entities/document.entity';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject:  [ConfigService],
      useFactory: (config: ConfigService) => ({
        type:       'postgres',
        url:        config.get<string>('DATABASE_URL'),
        entities:   [DocumentEntity],
        synchronize:true,
        logging:    false,
      }),
    }),

    TypeOrmModule.forFeature([DocumentEntity]),

    DocumentsModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject:  [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret:      config.get<string>('SECRET_KEY'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  // si vous aviez besoin de le fournir globalement :
  providers: [JwtAuthGuard],
})
export class AppModule {}