import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { AxiosError } from 'axios'

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001'

@Injectable()
export class AuthService {
  constructor(private readonly http: HttpService) {}

  async forwardRegister(body: { email: string; username: string; password: string }) {
    try {
      const res$ = this.http.post(`${AUTH_SERVICE_URL}/api/v1/auth/register`, body)
      const { data } = await firstValueFrom(res$)
      return data
    } catch (error) {
      this.handleAxiosError(error)
    }
  }

  async forwardLogin(body: { email: string; password: string }) {
    try {
      const res$ = this.http.post(`${AUTH_SERVICE_URL}/api/v1/auth/login`, body, {
        withCredentials: true,
      })
      const { data } = await firstValueFrom(res$)
      return data
    } catch (error) {
      this.handleAxiosError(error)
    }
  }

  async forwardRefresh(refreshToken: string) {
    try {
      const res$ = this.http.post(
        `${AUTH_SERVICE_URL}/api/v1/auth/refresh`,
        {},
        {
          withCredentials: true,
          headers: {
            Cookie: `refreshToken=${refreshToken}`,
          },
        },
      )
      const { data } = await firstValueFrom(res$)
      return {
        accessToken: data.accessToken,
        newRefreshToken: data.refreshToken,
      }
    } catch (error) {
      this.handleAxiosError(error)
    }
  }

  private handleAxiosError(error: unknown): never {
    if (error instanceof AxiosError) {
      const status = error.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR
      const message =
        error.response?.data?.message ?? 'Erreur lors de la communication avec auth-service'
      throw new HttpException(message, status)
    }
    throw new HttpException('Erreur réseau', HttpStatus.INTERNAL_SERVER_ERROR)
  }
}