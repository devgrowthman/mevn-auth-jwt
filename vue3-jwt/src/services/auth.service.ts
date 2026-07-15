import api from '@/api/axios'

import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RefreshResponse
} from '@/types/auth'

import type {
  User
} from '@/types/user'

export const authService = {
  login(payload: LoginPayload) {
    return api.post<LoginResponse> (
      '/auth/login',
      payload
    )
  },

  register(payload: RegisterPayload) {
    return api.post(
      '/auth/register',
      payload
    )
  },

  refresh() {
    return api.post<RefreshResponse>(
      '/auth/refresh'
    )
  },

  profile() {
    return api.get<User>(
      '/auth/profile'
    )
  },

  logout() {
    return api.post('/auth/logout')
  }
}

