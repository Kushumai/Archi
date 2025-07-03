import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: 'https://monarchipi.duckdns.org',
    credentials: true,
  });
  app.use(cookieParser());

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.disable('etag');

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`BFF service running on http://localhost:${port}/api/v1`);
}

bootstrap();
