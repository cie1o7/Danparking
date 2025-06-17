import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, STORAGE_KEYS, ERROR_MESSAGES } from '@/utils/constants';
import { ApiResponse, ApiError } from '@/types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - 토큰 자동 추가
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - 토큰 갱신 처리
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
            if (refreshToken) {
              const response = await this.client.post('/auth/token', {}, {
                headers: {
                  Authorization: `Bearer ${refreshToken}`,
                },
              });

              const { accessToken, refreshToken: newRefreshToken } = response.data.data;
              await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
              await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // 토큰 갱신 실패 시 로그아웃 처리
            await this.clearTokens();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: any): ApiError {
    if (error.response) {
      // 서버 응답이 있는 경우
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          return {
            code: 'VALIDATION_ERROR',
            message: data?.error?.message || ERROR_MESSAGES.VALIDATION_ERROR,
          };
        case 401:
          return {
            code: 'UNAUTHORIZED',
            message: ERROR_MESSAGES.UNAUTHORIZED,
          };
        case 403:
          return {
            code: 'FORBIDDEN',
            message: ERROR_MESSAGES.FORBIDDEN,
          };
        case 404:
          return {
            code: 'NOT_FOUND',
            message: ERROR_MESSAGES.NOT_FOUND,
          };
        case 500:
          return {
            code: 'SERVER_ERROR',
            message: ERROR_MESSAGES.SERVER_ERROR,
          };
        default:
          return {
            code: 'UNKNOWN_ERROR',
            message: data?.error?.message || ERROR_MESSAGES.UNKNOWN_ERROR,
          };
      }
    } else if (error.request) {
      // 네트워크 오류
      return {
        code: 'NETWORK_ERROR',
        message: ERROR_MESSAGES.NETWORK_ERROR,
      };
    } else {
      // 기타 오류
      return {
        code: 'UNKNOWN_ERROR',
        message: ERROR_MESSAGES.UNKNOWN_ERROR,
      };
    }
  }

  private async clearTokens() {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_INFO,
    ]);
  }

  // HTTP 메서드들
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // 파일 업로드
  async upload<T>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.post(url, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config?.headers,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

// 싱글톤 인스턴스 생성
const apiClient = new ApiClient();

export default apiClient;