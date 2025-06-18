import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { AxiosError } from 'axios'

const USER_SERVICE_URL = process.env.USER_SERVICE_URL

@Injectable()
export class UserService {
  constructor(private readonly http: HttpService) {}

  async findAll(token: string) {
    return this.forwardGet(`/api/v1/users`, token)
  }

  async findById(id: string, token: string) {
    return this.forwardGet(`/api/v1/users/${id}`, token)
  }

  async create(
    body: { userId: string; fullName: string; avatarUrl?: string; bio?: string },
    token: string,
  ) {
    return this.forwardPost(`/api/v1/users`, body, token)
  }

  async update(
    id: string,
    body: { fullName?: string; avatarUrl?: string; bio?: string },
    token: string,
  ) {
    return this.forwardPut(`/api/v1/users/${id}`, body, token)
  }

  async delete(id: string, token: string) {
    return this.forwardDelete(`/api/v1/users/${id}`, token)
  }

  private async forwardGet(path: string, token: string) {
    try {
      const res$ = this.http.get(`${USER_SERVICE_URL}${path}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const { data } = await firstValueFrom(res$)
      return data
    } catch (err) {
      this.handleAxiosError(err)
    }
  }

  private async forwardPost(path: string, body: any, token: string) {
    try {
      const res$ = this.http.post(`${USER_SERVICE_URL}${path}`, body, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const { data } = await firstValueFrom(res$)
      return data
    } catch (err) {
      this.handleAxiosError(err)
    }
  }

  private async forwardPut(path: string, body: any, token: string) {
    try {
      const res$ = this.http.put(`${USER_SERVICE_URL}${path}`, body, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const { data } = await firstValueFrom(res$)
      return data
    } catch (err) {
      this.handleAxiosError(err)
    }
  }

  private async forwardDelete(path: string, token: string) {
    try {
      const res$ = this.http.delete(`${USER_SERVICE_URL}${path}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const { data } = await firstValueFrom(res$)
      return data
    } catch (err) {
      this.handleAxiosError(err)
    }
  }

  private handleAxiosError(error: unknown): never {
    if (error instanceof AxiosError) {
      const status = error.response?.status ?? HttpStatus.INTERNAL_SERVER_ERROR
      const message = error.response?.data?.message ?? 'Erreur user-service'
      throw new HttpException(message, status)
    }
    throw new HttpException('Erreur réseau', HttpStatus.INTERNAL_SERVER_ERROR)
  }
}
