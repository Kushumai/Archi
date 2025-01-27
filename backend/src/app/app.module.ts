import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from '../shared/database/database.module';
import { EncryptionModule } from '../shared/encryption/encryption.module';
import { DocumentModule } from '../modules/document/document.module';
import { UserModule } from '../modules/user/user.module';
import { join } from 'path';
import { LoggerService } from '../shared/utils/logger.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { getEntitiesPath, getMigrationsPath } from '../shared/utils/path-helper';
const isLocal = process.env.NODE_ENV !== 'production';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://mongo:27017/mg_archi_db',
    ),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT || '5432', 10),
        username: process.env.DATABASE_USER || 'archiadmin',
        password: process.env.DATABASE_PASSWORD || 'password',
        database: process.env.DATABASE_NAME || 'psql_archi_db',
        entities: getEntitiesPath(process.env.NODE_ENV !== 'production'),
        migrations: getMigrationsPath(isLocal),
        autoLoadEntities: true,
        synchronize: false,
        logging: true,
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    DocumentModule,
    DatabaseModule,
    EncryptionModule,
  ],
  controllers: [AppController],
  providers: [
    LoggerService,
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [LoggerService],
})
export class AppModule {}