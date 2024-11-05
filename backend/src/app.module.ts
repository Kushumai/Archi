import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Import TypeOrmModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { EncryptionModule } from './encryption/encryption.module';
import { DocumentModule } from './document/document.module';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST || 'postgres',  // Utilise le nom de service "postgres"
        port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
        username: process.env.DATABASE_USER || 'user',
        password: process.env.DATABASE_PASSWORD || 'password',
        database: process.env.DATABASE_NAME || 'dev_db',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'], // Charge les entités
        synchronize: true, // À utiliser seulement en développement
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