import apiClient from './api';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User, 
  ApiResponse 
} from '@/types';

export class AuthService {
  /**
   * 로그인
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    if (response.error) {
      throw response.error;
    }
    
    return response.data;
  }

  /**
   * 구글 로그인
   */
  async googleLogin(idToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/google', { idToken });
    
    if (response.error) {
      throw response.error;
    }
    
    return response.data;
  }

  /**
   * 회원가입
   */
  async register(userData: RegisterRequest): Promise<string> {
    const response = await apiClient.post<string>('/users/register', userData);
    
    if (response.error) {
      throw response.error;
    }
    
    return response.data;
  }

  /**
   * 로그아웃
   */
  async logout(): Promise<string> {
    const response = await apiClient.post<string>('/auth/logout');
    
    if (response.error) {
      throw response.error;
    }
    
    return response.data;
  }

  /**
   * 토큰 갱신
   */
  async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/token');
    
    if (response.error) {
      throw response.error;
    }
    
    return response.data;
  }

  /**
   * 사용자 정보 조회
   */
  async getUserInfo(): Promise<User> {
    const response = await apiClient.get<User>('/users/info');
    
    if (response.error) {
      throw response.error;
    }
    
    return response.data;
  }

  /**
   * 사용자 정보 수정
   */
  async updateUserInfo(userData: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>('/users/info', userData);
    
    if (response.error) {
      throw response.error;
    }
    
    return response.data;
  }

  /**
   * 회원 탈퇴
   */
  async deleteUser(): Promise<string> {
    const response = await apiClient.delete<string>('/users/info');
    
    if (response.error) {
      throw response.error;
    }
    
    return response.data;
  }
}

export const authService = new AuthService();