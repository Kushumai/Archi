import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';


async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AuthModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_PROD_URL || 'http://archi_frontend_prod:80']
  : [
    process.env.FRONTEND_DEV_URL || 'http://archi_frontend_dev:3001',
  ];

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT || 3002;
  await app.listen(port, '0.0.0.0');
  console.log(`Authentication service running on port ${port}`);
}

bootstrap();