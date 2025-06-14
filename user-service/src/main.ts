import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const port = process.env.PORT ? Number(process.env.PORT) : 3002;
  await app.listen(port);
  console.log(`User Service (Nest) running on http://localhost:${port}`);
}
bootstrap();
