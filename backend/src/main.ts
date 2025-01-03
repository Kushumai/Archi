import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  app.setGlobalPrefix('api');
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${process.env.PORT || 3000}/api`);
}
bootstrap();