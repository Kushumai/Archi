import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from './database/database.module';
import { EncryptionModule } from './encryption/encryption.module';
import { DocumentModule } from './document/document.module';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/dev_db',
    ),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST || 'postgres',
        port: parseInt(process.env.DATABASE_PORT || '5432', 10),
        username: process.env.DATABASE_USER || 'postgres',
        password: process.env.DATABASE_PASSWORD || 'password',
        database: process.env.DATABASE_NAME || 'dev_db',
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
  providers: [AppService],
})
export class AppModule {}