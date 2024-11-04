import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { EncryptionModule } from './encryption/encryption.module';
import { DocumentModule } from './document/document.module';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [AuthModule, UserModule, DocumentModule, DatabaseModule, CommonModule, EncryptionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
