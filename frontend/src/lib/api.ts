import axios from "axios"

let accessToken: string | null = null

export const setAccessToken = (token: string | null) => {
  accessToken = token
}

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const res = await api.post("/auth/refresh", {}, { withCredentials: true })
        const newAccessToken = res.data.accessToken
        setAccessToken(newAccessToken)
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch {
        setAccessToken(null)
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  }
)
