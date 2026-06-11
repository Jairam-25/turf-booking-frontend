import { AuthResponseDto } from '../dtos/auth.dto';
import { AuthResponse } from '../../domain/models/user.model';

export class AuthMapper {
  static fromDto(dto: AuthResponseDto): AuthResponse {
    const data = (dto || {}) as any;
    
    return {
      user: {
        name: data.name || data.Name || '',
        email: data.email || data.Email || '',
        phoneNumber: data.phoneNumber || data.PhoneNumber || data.number || data.Number || '',
        profilePictureUrl: data.profilePictureUrl || data.ProfilePictureUrl || '',
        role: data.role || data.Role || 'User'
      },
      auth: {
        token: data.token || data.Token || '',
        refreshToken: data.refreshToken || data.RefreshToken || ''
      }
    };
  }
}
