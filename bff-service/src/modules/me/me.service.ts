import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'

@Injectable()
export class MeService {
  constructor(private readonly http: HttpService) {}

  async getFullUserInfo(userId: string, accessToken: string) {
    try {
      const [authRes, profileRes] = await Promise.all([
        this.http.axiosRef.get(`http://auth-service:3001/api/auth/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        this.http.axiosRef.get(`http://user-service:3002/api/v1/profiles/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      ])

      return {
        ...authRes.data,
        profile: profileRes.data,
      }
    } catch (error) {
      console.error('❌ Error in MeService:', error?.response?.data || error)
      throw new Error('Failed to fetch user data')
    }
  }
}