export interface LoginRequestDto {
  emailOrPhone: string;
  password: string;
}

export interface RegisterRequestDto {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponseDto {
  name: string;
  email: string;
  number: string;
  role: string;
  profilePictureUrl?: string;
  token: string;
  refreshToken: string;
}
