import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import { AuthProvider } from '@/contexts/AuthContext';
import { useAppStore } from '@/store/store';
import AppNavigator from '@/navigation/AppNavigator';
import { COLORS } from '@/utils/constants';

// React Query 클라이언트 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5분
      cacheTime: 10 * 60 * 1000, // 10분
    },
    mutations: {
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  const { initializeSearchHistory } = useAppStore();

  useEffect(() => {
    // 앱 시작 시 검색 기록 초기화
    initializeSearchHistory();
  }, [initializeSearchHistory]);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <NavigationContainer>
            <StatusBar
              barStyle="dark-content"
              backgroundColor={COLORS.background}
              translucent={false}
            />
            <AppNavigator />
            <Toast />
          </NavigationContainer>
        </AuthProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default App;