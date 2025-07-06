import {
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { Request } from 'express';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:3002';
const DOCUMENT_SERVICE_URL = process.env.DOCUMENT_SERVICE_URL!;

interface Document {
  id: string;
  name: string;
}

@Injectable()
export class MeService {
  constructor(
    private readonly http: HttpService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async getMe(token: string) {
    const decoded = this.jwtService.decode(token) as { sub?: string };
    if (!decoded?.sub) {
      throw new UnauthorizedException('Invalid token');
    }

    try {
      const auth$ = this.http.get<{ id: string; email: string }>(
        `${AUTH_SERVICE_URL}/api/v1/auth/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const profile$ = this.http.get(
        `${USER_SERVICE_URL}/api/v1/users/me`,
        { headers: { Authorization: `Bearer ${this.generateServiceToken()}` } }
      );
      const [authRes, profileRes]: [
        AxiosResponse<{ id: string; email: string }>,
        AxiosResponse<any>
      ] = await Promise.all([
        firstValueFrom(auth$),
        firstValueFrom(profile$),
      ]);

      return {
        id: authRes.data.id,
        email: authRes.data.email,
        profile: profileRes.data,
      };
    } catch (err) {
      if (err instanceof AxiosError) {
        throw new HttpException(
          (err.response?.data as any)?.message || 'Erreur getMe',
          err.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      throw new HttpException('Erreur réseau getMe', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getMyDocuments(authHeader: string): Promise<Document[]> {
    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid Authorization header');
    }

    try {
      const obs$ = this.http.get<Document[]>(
        `${DOCUMENT_SERVICE_URL}/api/v1/documents/me`,
        { headers: { Authorization: authHeader } }
      );
      const axiosRes: AxiosResponse<Document[]> = await firstValueFrom(obs$);
      return axiosRes.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        throw new HttpException(
          (err.response?.data as any)?.message || 'Erreur getMyDocuments',
          err.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      throw new HttpException('Erreur réseau getMyDocuments', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async uploadMyDocument(authHeader: string, req: Request): Promise<any> {
    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid Authorization header');
    }

    try {
      const obs$ = this.http.post(
        `${DOCUMENT_SERVICE_URL}/api/v1/documents/me`,
        req,
        {
          headers: {
            Authorization: authHeader,
            'Content-Type': req.headers['content-type'] as string,
          },
          responseType: 'json',
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        }
      );
      const axiosRes: AxiosResponse = await firstValueFrom(obs$);
      return axiosRes.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        throw new HttpException(
          (err.response?.data as any)?.message || 'Erreur uploadMyDocument',
          err.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      throw new HttpException('Erreur réseau uploadMyDocument', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private generateServiceToken(): string {
    return this.jwtService.sign(
      { service: 'bff-service' },
      {
        secret: this.config.getOrThrow<string>('SERVICE_SECRET'),
        expiresIn: '10m',
      },
    );
  }
  async deleteMyDocument(authHeader: string, docId: string): Promise<void> {
    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid Authorization header');
    }
    try {
      const obs$ = this.http.delete(
        `${DOCUMENT_SERVICE_URL}/api/v1/documents/me/${docId}`,
        { headers: { Authorization: authHeader } }
      );
      await firstValueFrom(obs$);
    } catch (err) {
      if (err instanceof AxiosError) {
        throw new HttpException(
          (err.response?.data as any)?.message || 'Erreur deleteMyDocument',
          err.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      throw new HttpException('Erreur réseau deleteMyDocument', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteAllMyDocuments(authHeader: string): Promise<void> {
    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid Authorization header');
    }
    try {
      const obs$ = this.http.delete(
        `${DOCUMENT_SERVICE_URL}/api/v1/documents/me`,
        { headers: { Authorization: authHeader } }
      );
      await firstValueFrom(obs$);
    } catch (err) {
      console.log('Appel document-service avec Authorization :', authHeader);
      if (err instanceof AxiosError) {
        throw new HttpException(
          (err.response?.data as any)?.message || 'Erreur deleteAllMyDocuments',
          err.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      throw new HttpException('Erreur réseau deleteAllMyDocuments', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteMyAccount(authHeader: string): Promise<void> {
    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid Authorization header');
    }

    await this.deleteAllMyDocuments(authHeader);

    try {
      const obs$ = this.http.delete(
        `${USER_SERVICE_URL}/api/v1/users/me`,
        { headers: { Authorization: authHeader } }
      );
      await firstValueFrom(obs$);
    } catch (err) {
      if (err instanceof AxiosError) {
        throw new HttpException(
          (err.response?.data as any)?.message || 'Erreur deleteUserProfile',
          err.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      throw new HttpException('Erreur réseau deleteUserProfile', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    try {
      const obs$ = this.http.delete(
        `${AUTH_SERVICE_URL}/api/v1/auth/me`,
        { headers: { Authorization: authHeader } }
      );
      await firstValueFrom(obs$);
    } catch (err) {
      if (err instanceof AxiosError) {
        throw new HttpException(
          (err.response?.data as any)?.message || 'Erreur deleteAuthAccount',
          err.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
      throw new HttpException('Erreur réseau deleteAuthAccount', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}