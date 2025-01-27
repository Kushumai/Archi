import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from '../shared/database/data-source';
import { ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { DataSource } from 'typeorm';

async function bootstrap() {

  try {
    await AppDataSource.initialize();
    console.log('Database connection established');
  } catch (error) {
    console.error('Error during Data Source initialization:', error);
    process.exit(1); // Arrêter l'application si la base de données est inaccessible
  }

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

  // const app = await NestFactory.create(AppModule);
  // const dataSource = DataSource();
  // console.log('Loaded entities:', connection.entityMetadatas.map((meta) => meta.name));
  // await app.listen(3000);  
}

bootstrap();
