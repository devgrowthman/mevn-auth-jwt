import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios'
import { useAuthStore } from '@/stores/auth.store'
import router from '@/router'

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const API_URL = import.meta.env.VITE_API_URL
let isRefreshing = false                            // → menandakan apakah sedang ada proses refresh token.
let refreshPromise: Promise<string> |null = null    // → promise yang akan ditunggu oleh request lain.

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// helper refreshAccessToken()
const refreshAccessToken = async (): Promise<string> => {
  const authStore = useAuthStore()

  const { data } = await axios.post(
    `${API_URL}/auth/refresh`,
    {},
    {
      withCredentials: true,
    }
  )

  authStore.setToken(data.accessToken)

  return data.accessToken
}

/**
 * Request Interceptor
 * Menambahkan Access Token ke setiap request.
 */
api.interceptors.request.use((config) => {
  const authStore = useAuthStore()

  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`
  }

  return config
})

/**
 * Response Interceptor
 *
 * Ketika Access Token expired:
 * 1. Request Refresh Token
 * 2. Simpan Access Token baru
 * 3. Ulangi request sebelumnya
 */
api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    if (!error.config) {
      return Promise.reject(error)
    }

    const originalRequest = error.config as RetryRequestConfig

    const isRefreshRequest =
      originalRequest.url?.includes('/auth/refresh')

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshRequest
    ) {
      originalRequest._retry = true

      const authStore = useAuthStore()

      try {
      //   const { data } = await axios.post(
      //     `${API_URL}/auth/refresh`,
      //     {},
      //     {
      //       withCredentials: true,
      //     }
      //   )

      //   authStore.setToken(data.accessToken)

        // originalRequest.headers.Authorization =
        //   `Bearer ${data.accessToken}`

        // return api(originalRequest)

        /**
         * Refresh Queue (Promise Lock)
         *
         * Mencegah beberapa request melakukan proses refresh access token
         * secara bersamaan ketika banyak request menerima respon 401.
         *
         * Mekanisme:
         * - Request pertama akan melakukan refresh token.
         * - Request lainnya akan menunggu proses refresh selesai.
         * - Setelah access token baru diterima, seluruh request akan
         *   menggunakan token tersebut dan mengulangi request sebelumnya.
         *
         * Dengan cara ini backend hanya menerima satu request
         * ke endpoint `/auth/refresh`, sehingga menghindari race condition
         * dan refresh storm.
         */
        
        if (!isRefreshing) {
          isRefreshing = true

          refreshPromise = refreshAccessToken()
            .finally(() => {
              isRefreshing = false
              refreshPromise = null
            })
        }

        const newAccessToken = await refreshPromise

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`

        return api(originalRequest)

      } catch (refreshError) {
        authStore.logout()

        authStore.clearAuth()

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api