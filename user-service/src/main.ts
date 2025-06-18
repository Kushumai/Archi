import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json())
  app.use(urlencoded({ extended: true }))
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
  }));

  const port = process.env.PORT ? Number(process.env.PORT) : 3002;
  await app.listen(port);
  console.log(`User Service (Nest) running on http://localhost:${port}`);
}
bootstrap();
