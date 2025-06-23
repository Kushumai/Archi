import {
  Controller,
  Get,
  Req,
  Res,
  Param,
  UseGuards,
  UnauthorizedException,
  Header,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MeService } from './me.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Controller('me')
export class MeController {
  private readonly documentServiceUrl: string;

  constructor(
    private readonly meService: MeService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.documentServiceUrl =
      this.configService.get<string>('DOCUMENT_SERVICE_URL')! + '/api/v1';
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @Header('Cache-Control', 'no-store')
  async getMe(@Req() req: Request, @Res() res: Response) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }
    const token = auth.replace('Bearer ', '');
    const data = await this.meService.getMe(token);
    return res.json(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('documents')
  @Header('Cache-Control', 'no-store')
  async getMyDocuments(@Req() req: Request, @Res() res: Response) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }
    const docs = await this.meService.getMyDocuments(auth);
    return res.json(docs);
  }

  @UseGuards(JwtAuthGuard)
  @Get('documents/:id/file')
  async downloadMyDocument(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const authHeader = req.headers.authorization!;
    const upstream = await this.httpService.axiosRef.get(
      `${this.documentServiceUrl}/documents/me/${id}/file`,
      { headers: { Authorization: authHeader }, responseType: 'stream' },
    );

    const type = upstream.headers['content-type'];
    if (type) {
      res.setHeader('Content-Type', type as string);
    }

    return upstream.data.pipe(res);
  }
}