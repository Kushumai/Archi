import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  })

  app.use(cookieParser())

  await app.listen(3002, '0.0.0.0')
  console.log('✅ Auth Service running on http://localhost:3002')
}
bootstrap()