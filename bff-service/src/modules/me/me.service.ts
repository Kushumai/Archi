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

    const authServiceUrl = this.config.getOrThrow<string>('AUTH_SERVICE_URL');
    const userServiceUrl = this.config.getOrThrow<string>('USER_SERVICE_URL');

    try {
      const auth$ = this.http.get<{ id: string; email: string }>(
        `${authServiceUrl}/api/v1/auth/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const userId = decoded.sub;
      const profile$ = this.http.get(
        `${userServiceUrl}/api/v1/users/by-user-id/${userId}`,
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
    const documentServiceUrl = this.config.getOrThrow<string>('DOCUMENT_SERVICE_URL');
    try {
      const obs$ = this.http.get<Document[]>(
        `${documentServiceUrl}/api/v1/documents/me`,
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
    const documentServiceUrl = this.config.getOrThrow<string>('DOCUMENT_SERVICE_URL');
    try {
      const obs$ = this.http.post(
        `${documentServiceUrl}/api/v1/documents/me`,
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
    const documentServiceUrl = this.config.getOrThrow<string>('DOCUMENT_SERVICE_URL');
    try {
      const obs$ = this.http.delete(
        `${documentServiceUrl}/api/v1/documents/me/${docId}`,
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
    const documentServiceUrl = this.config.getOrThrow<string>('DOCUMENT_SERVICE_URL');
    try {
      const obs$ = this.http.delete(
        `${documentServiceUrl}/api/v1/documents/me`,
        { headers: { Authorization: authHeader } }
      );
      await firstValueFrom(obs$);
    } catch (err) {
      const axiosErr = err as AxiosError;
      console.error('Erreur deleteAllMyDocuments:', axiosErr?.response?.data || err);
      throw new HttpException(
        (axiosErr.response?.data as any)?.message || 'Erreur deleteAllMyDocuments',
        axiosErr.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteMyAccount(authHeader: string): Promise<void> {
    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid Authorization header');
    }

    // 1. Suppression des documents utilisateur
    console.log("[BFF] Suppression de tous les documents utilisateur...");
    await this.deleteAllMyDocuments(authHeader);

    // 2. Récupération du userId depuis le JWT
    const token = authHeader.replace('Bearer ', '');
    const decoded = this.jwtService.decode(token) as { sub?: string };
    if (!decoded?.sub) {
      console.log("[BFF] Invalid token: missing sub");
      throw new UnauthorizedException('Invalid token: missing sub');
    }
    const userId = decoded.sub;

    // 3. Récupération du profil via user-service
    const userServiceUrl = this.config.getOrThrow<string>('USER_SERVICE_URL');
    const serviceToken = this.generateServiceToken();
    let userProfile;
    try {
      console.log("[BFF] Recherche du profil user-service via userId =", userId);
      const userRes = await firstValueFrom(
        this.http.get(`${userServiceUrl}/api/v1/users/by-user-id/${userId}`, {
          headers: { Authorization: `Bearer ${serviceToken}` },
        })
      );
      userProfile = userRes.data;
      console.log("[BFF] Profil utilisateur trouvé :", userProfile);
    } catch (err) {
      const axiosErr = err as AxiosError;
      console.error("[BFF] Erreur lors de la récupération du profil utilisateur", axiosErr?.response?.data || err);
      throw new HttpException('Erreur lors de la récupération du profil utilisateur', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (!userProfile || !userProfile.id) {
      console.log("[BFF] Profil utilisateur introuvable");
      throw new HttpException('Profil utilisateur introuvable', HttpStatus.NOT_FOUND);
    }

    // 4. Suppression du profil user-service
    try {
      console.log("[BFF] Suppression du profil user-service avec id =", userProfile.id);
      await firstValueFrom(
        this.http.delete(
          `${userServiceUrl}/api/v1/users/${userProfile.id}`,
          { headers: { Authorization: `Bearer ${serviceToken}` } }
        )
      );
    } catch (err) {
      const axiosErr = err as AxiosError;
      console.error("[BFF] Erreur lors de la suppression du profil utilisateur", axiosErr?.response?.data || err);
      throw new HttpException('Erreur lors de la suppression du profil utilisateur', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 5. Suppression du compte auth-service (cette fois, ça va marcher)
    const authServiceUrl = this.config.getOrThrow<string>('AUTH_SERVICE_URL');
    try {
      console.log("[BFF] Suppression du compte auth-service...");
      await firstValueFrom(
        this.http.delete(
          `${authServiceUrl}/api/v1/auth/me`,
          { headers: { Authorization: authHeader } }
        )
      );
    } catch (err) {
      const axiosErr = err as AxiosError;
      console.error("[BFF] Erreur lors de la suppression du compte auth-service", axiosErr?.response?.data || err);
      throw new HttpException('Erreur lors de la suppression du compte auth-service', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    console.log("[BFF] Suppression totale terminée !");
  }
}
