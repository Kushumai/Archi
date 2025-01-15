import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  // const allowedOrigins = (process.env.NODE_ENV === 'production'
  //   ? [process.env.AUTH_SERVICE_PROD_URL]
  //   : [process.env.AUTH_SERVICE_DEV_URL, 'http://localhost:3000']
  // ).filter((origin) => origin !== undefined);

  const allowedOrigins = [
    'http://localhost:3000',
    'http://archi_frontend_dev:3001',
    'http://archi_auth_service_dev:3002',
  ];

  const reflector = app.get(Reflector);
  // app.useGlobalGuards(new JwtAuthGuard(reflector, app.get(JwtService)));

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('api');
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://localhost:${port}/api`);
}

bootstrap();
