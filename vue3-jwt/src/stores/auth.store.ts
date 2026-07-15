import { defineStore } from "pinia";
import { authService } from "@/services/auth.service";  

import type {
  AuthState,
  LoginPayload,
  RegisterPayload
} from '@/types/auth'

export const useAuthStore = defineStore(
  'auth',
  {
    state: (): AuthState => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      initialized: false, 
    }),

    // getters: {
    //   isAuthenticated: (state) => !!state.accessToken
    // },
  
    actions: {
      setToken(token: string | null) {
        this.accessToken = token
        this.isAuthenticated = !!token
      },

      setUser(user: any) {
        this.user = user
      },

      setInitialized(value: boolean) {
        this.initialized = value
      },

      clearAuth() {
        this.accessToken = null,
        this.user = null,
        this.isAuthenticated = false
      },

      async register(payload: RegisterPayload) {
        return authService.register(payload)
      },

      async login(payload: LoginPayload) {
        try {
          this.isLoading = true

          const response = await authService.login(payload)
          const {
            accessToken,
            user
          } = response.data

          this.setToken(accessToken)
          this.setUser(user)

          return response.data

        } catch(error) {
          console.log('error login', error)
        } finally {
          this.isLoading = false
        }
      },

      async profile() {
        try {
          const response = await authService.profile()

          this.setUser(response.data)
          return response.data
          
        } catch(error) {
          this.clearAuth()
          throw error
        }
      },

      async refresh() {
        try {
          const response = await authService.refresh()
          this.setToken(response.data.accessToken)
          this.setInitialized(true)

          return response.data
        } catch(error) {
          this.clearAuth()
          throw error
        }
      },

      async logout() {
        try {
          await authService.logout()
        } finally {
          this.clearAuth()
        }
      }
    }
  }
)