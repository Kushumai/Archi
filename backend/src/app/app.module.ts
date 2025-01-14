import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from '../database/database.module';
import { EncryptionModule } from '../encryption/encryption.module';
import { DocumentModule } from '../modules/document/document.module';
import { UserModule } from '../modules/user/user.module';
import { CommonModule } from '../common/common.module';
import { join } from 'path';
import { LoggerService } from '../core/logger.service';

@Module({
  providers: [LoggerService, AppService],
  exports: [LoggerService],
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://mongo:27017/mg_archi_db',
    ),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST || 'postgres',
        port: parseInt(process.env.DATABASE_PORT || '5432', 10),
        username: process.env.DATABASE_USER || 'user',
        password: process.env.DATABASE_PASSWORD || 'password',
        database: process.env.DATABASE_NAME || 'psql_archi_db',
        entities: [join(__dirname, '**', '*.entity{.js,.ts}')],
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
      }),
    }),
    AuthModule,
    UserModule,
    DocumentModule,
    DatabaseModule,
    CommonModule,
    EncryptionModule,
  ],
  controllers: [AppController],
})
export class AppModule {}