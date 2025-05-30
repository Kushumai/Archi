import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Ajoute le préfixe global /api
  app.setGlobalPrefix('api');

  // Validation globale
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  await app.listen(port);
  console.log(`User Service (Nest) running on http://localhost:${port}`);
}
bootstrap();
