// document-service/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Si vous voulez un préfixe global REST :
  app.setGlobalPrefix('api');   // facultatif : /api/documents

  // ** C’EST ICI **
  await app.listen(3004);
  console.log(`📂 Document Service running on http://localhost:3004`);
}
bootstrap();