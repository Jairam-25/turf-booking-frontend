export interface User {
  name: string;
  email: string;
  phoneNumber: string;
  profilePictureUrl?: string;
  role: string;
  address?: string;
  state?: string;
  maritalStatus?: string;
  playerType?: string;
  playingLevel?: string;
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
