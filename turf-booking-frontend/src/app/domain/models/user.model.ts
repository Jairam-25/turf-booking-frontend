export interface User {
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
}

export interface AuthToken {
  token: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface AuthResponse {
  user: User;
  auth: AuthToken;
}
