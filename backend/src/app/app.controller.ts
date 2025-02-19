import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app')
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
}
