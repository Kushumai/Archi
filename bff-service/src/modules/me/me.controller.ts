import {
  Controller,
  Get,
  Req,
  Res,
  Param,
  UseGuards,
  UnauthorizedException,
  Header,
  BadRequestException,
  Body,
  Post,
  UploadedFile,
  UseInterceptors,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MeService } from './me.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import FormData from 'form-data';
import { AuthRequest } from "../../common/types/auth-request";

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

  @UseGuards(JwtAuthGuard)
  @Post('documents')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMyDocuments(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title: string; description?: string; category: string },
  ) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }
    const { title, description, category } = body;
    if (!title || !category || !file) {
      throw new BadRequestException('Titre, catégorie et fichier obligatoires.');
    }

    const form = new FormData();
    form.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    form.append('title', title);
    form.append('category', category);
    if (description) {
      form.append('description', description);
    }

    const response = await this.httpService.axiosRef.post(
      `${this.documentServiceUrl}/documents/me`,
      form,
      {
        headers: {
          Authorization: auth,
          ...form.getHeaders(),
        },
      },
    );

    return response.data;
  }
  
  @UseGuards(JwtAuthGuard)
  @Delete('documents/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMyDocument(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }
    await this.meService.deleteMyDocument(auth, id);
    return res.status(HttpStatus.NO_CONTENT).send();
  }

  @UseGuards(JwtAuthGuard)
  @Delete('documents')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllMyDocuments(@Req() req: AuthRequest, @Res() res: Response) {
    console.log("headers", req.headers);
    console.log("user", req.user);
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }
    await this.meService.deleteAllMyDocuments(auth);
    return res.status(HttpStatus.NO_CONTENT).send();
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMyAccount(@Req() req: Request, @Res() res: Response) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }
    await this.meService.deleteMyAccount(auth);
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}