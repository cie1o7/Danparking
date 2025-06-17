import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';
import { STORAGE_KEYS } from '@/utils/constants';
import { authService } from '@/services/auth';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserInfo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const [accessToken, userInfo] = await AsyncStorage.multiGet([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.USER_INFO,
      ]);

      if (accessToken[1] && userInfo[1]) {
        const parsedUser = JSON.parse(userInfo[1]);
        setUser(parsedUser);
        setIsLoggedIn(true);
        
        // 서버에서 최신 사용자 정보 조회
        try {
          const latestUserInfo = await authService.getUserInfo();
          setUser(latestUserInfo);
          await AsyncStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(latestUserInfo));
        } catch (error) {
          // 토큰이 만료되었거나 유효하지 않은 경우 로그아웃 처리
          console.log('Failed to refresh user info:', error);
          await logout();
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const authResponse = await authService.login({ email, password });
      
      // 토큰 저장
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.ACCESS_TOKEN, authResponse.accessToken],
        [STORAGE_KEYS.REFRESH_TOKEN, authResponse.refreshToken],
      ]);

      // 사용자 정보 조회 및 저장
      const userInfo = await authService.getUserInfo();
      setUser(userInfo);
      setIsLoggedIn(true);
      
      await AsyncStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      
      await authService.register({ email, password, name });
      
      // 회원가입 후 자동 로그인
      await login(email, password);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // 서버에 로그아웃 요청
      try {
        await authService.logout();
      } catch (error) {
        // 서버 로그아웃 실패해도 클라이언트는 로그아웃 처리
        console.log('Server logout failed:', error);
      }
      
      // 로컬 데이터 삭제
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER_INFO,
        STORAGE_KEYS.MY_PARKING_LOCATION,
      ]);
      
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshUserInfo = async () => {
    try {
      const userInfo = await authService.getUserInfo();
      setUser(userInfo);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
    } catch (error) {
      console.error('Failed to refresh user info:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoggedIn,
    isLoading,
    login,
    register,
    logout,
    refreshUserInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};