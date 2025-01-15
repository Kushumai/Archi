import { Controller, Get } from '@nestjs/common';
import { Public } from '../decorators/public.decorator';
import { AppService } from './app.service';

@Controller('app') // Ajoute 'api/app' comme préfixe global
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getRoot(): string {
    return 'Welcome to the API!';
  }

  @Get('test')
  getTest(): { message: string } {
    return { message: 'API test successful' };
  }

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('public')
  getPublicRoute(): string {
    return 'This is a public route!';
  }
}
