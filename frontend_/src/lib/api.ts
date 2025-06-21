import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"

type FailedRequest = {
  resolve: (value: string) => void
  reject: (error: Error) => void
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

let accessToken: string | null = null
let isRefreshing = false
const failedQueue: FailedRequest[] = []

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else if (token) {
      resolve(token)
    }
  })
  failedQueue.length = 0
}

export const setAccessToken = (token: string | null) => {
  accessToken = token
}

export const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig | undefined

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        try {
          const token = await new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`
          }
          return await api(originalRequest)
        } catch (err) {
          return Promise.reject(err)
        }
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const res = await api.post("/auth/refresh", {}, { withCredentials: true })
        const newAccessToken = res.data.accessToken
        setAccessToken(newAccessToken)
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        }
        processQueue(null, newAccessToken)
        return await api(originalRequest)
      } catch (err) {
        setAccessToken(null)
        processQueue(err as Error, null)
        window.location.href = "/login"
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)