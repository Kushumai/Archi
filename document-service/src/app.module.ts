// document-service/src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { DocumentsModule } from './documents/documents.module';
import { DocumentEntity } from './documents/entities/document.entity';
//import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';

@Module({
  imports: [
    // 1) Connexion à la base
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,   // ex: 'postgres://postgres:postgres@localhost:5432/myappdb'
      entities: [DocumentEntity],
      synchronize: true,
    }),

    // 2) Déclaration de l’entity pour injection dans vos modules
    TypeOrmModule.forFeature([DocumentEntity]),

    // 3) Module fonctionnel documents
    DocumentsModule,

    // 4) Module JWT pour le guard
    JwtModule.register({
      secret: process.env.SECRET_KEY,   // même SECRET_KEY que dans auth-service
      signOptions: { expiresIn: '1h' },
    }),
  ],
  // si vous aviez besoin de le fournir globalement :
  //providers: [JwtAuthGuard],
})
export class AppModule {}