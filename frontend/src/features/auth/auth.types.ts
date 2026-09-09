export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  role: number;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}