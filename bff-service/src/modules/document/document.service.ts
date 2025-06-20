import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { Request, Response } from 'express';

const DOCUMENT_SERVICE_URL = process.env.DOCUMENT_SERVICE_URL;

@Injectable()
export class DocumentService {
  constructor(
    private readonly http: HttpService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  private generateServiceToken(): string {
    return this.jwt.sign(
      { service: 'bff-service' },
      {
        secret: this.config.getOrThrow<string>('SERVICE_SECRET'),
        expiresIn: '5m',
      },
    );
  }

  private async forwardGet(path: string, req: Request, responseType?: 'stream') {
    const token = this.generateServiceToken();
    try {
      const res$ = this.http.get(`${DOCUMENT_SERVICE_URL}${path}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType,
      });
      return await firstValueFrom(res$);
    } catch (err) {
      this.handleAxiosError(err);
    }
  }

  private async forwardPost(path: string, req: Request, body: any) {
    const token = this.generateServiceToken();
    try {
      const res$ = this.http.post(`${DOCUMENT_SERVICE_URL}${path}`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { data } = await firstValueFrom(res$);
      return data;
    } catch (err) {
      this.handleAxiosError(err);
    }
  }

  private async forwardDelete(path: string, req: Request) {
    const token = this.generateServiceToken();
    try {
      const res$ = this.http.delete(`${DOCUMENT_SERVICE_URL}${path}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { data } = await firstValueFrom(res$);
      return data;
    } catch (err) {
      this.handleAxiosError(err);
    }
  }

  private handleAxiosError(error: unknown): never {
    if (error instanceof AxiosError) {
      const status = error.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
      const message = error.response?.data?.message ?? 'Erreur document-service';
      throw new HttpException(message, status);
    }
    throw new HttpException('Erreur réseau', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async findMyDocuments(req: Request, limit?: string, offset?: string) {
    const query = new URLSearchParams();
    if (limit) query.set('limit', limit);
    if (offset) query.set('offset', offset);

    return this.forwardGet(`/api/v1/documents?${query.toString()}`, req);
  }

  async create(req: Request, body: any) {
    return this.forwardPost(`/api/v1/documents`, req, body);
  }

  async download(req: Request, id: string, res: Response) {
    const remote = await this.forwardGet(`/api/v1/documents/${id}/file`, req, 'stream');
    res.set(remote.headers);
    remote.data.pipe(res);
  }

  async remove(req: Request, id: string) {
    return this.forwardDelete(`/api/v1/documents/${id}`, req);
  }

  async findByUserId(userId: string, limit?: string, offset?: string) {
    const query = new URLSearchParams();
    if (limit) query.set('limit', limit);
    if (offset) query.set('offset', offset);

    return this.forwardGet(`/api/v1/documents/user/${userId}?${query.toString()}`, {} as Request);
  }

  async findAll(limit?: string, offset?: string) {
    const query = new URLSearchParams();
    if (limit) query.set('limit', limit);
    if (offset) query.set('offset', offset);

    return this.forwardGet(`/api/v1/documents?${query.toString()}`, {} as Request);
  }
}