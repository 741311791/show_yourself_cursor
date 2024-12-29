export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends LoginCredentials {
  username: string
  confirmPassword: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    username: string
  }
}

export interface ResetPasswordData {
  email: string
  token: string
  password: string
  confirmPassword: string
} 