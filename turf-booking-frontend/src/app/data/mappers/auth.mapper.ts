import { AuthResponseDto } from '../dtos/auth.dto';
import { AuthResponse } from '../../domain/models/user.model';

export class AuthMapper {
  static fromDto(dto: AuthResponseDto): AuthResponse {
    if (!dto) return {} as AuthResponse;
    
    const data = dto as any;
    return {
      user: {
        name: dto.name || data.Name,
        email: dto.email || data.Email,
        phoneNumber: dto.number || data.Number,
        role: dto.role || data.Role
      },
      auth: {
        token: dto.token || data.Token,
        refreshToken: dto.refreshToken || data.RefreshToken
      }
    };
  }
}
