export type Role = 'USER' | 'ADMIN'

export interface User {
  id: string,
  username: string,
  name: string,
  email: string,
  role: Role,
  createdAt: string,
}