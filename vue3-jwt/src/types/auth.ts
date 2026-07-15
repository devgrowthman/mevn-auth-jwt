import type { User } from './user'

export interface AuthState {
  accessToken: string | null,
  user: User | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  initialized: boolean
}

export interface LoginPayload {
  username: string,
  password: string,
}

export interface RegisterPayload {
  username: string,
  password: string,
  role: 'USER' | 'ADMIN',
}

export interface RegisterForm extends RegisterPayload {
  confirmPassword: string
}

export interface LoginResponse {
  accessToken: string,
  user: User,
}

export interface RefreshResponse {
  accessToken: string
}