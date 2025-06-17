import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@/contexts/AuthContext';
import { RootStackParamList } from '@/types';

import LoginScreen from '@/screens/LoginScreen';
import BottomTabNavigator from './BottomTabNavigator';
import ParkingFloorPlanScreen from '@/screens/ParkingFloorPlanScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    // TODO: 로딩 스크린 컴포넌트 추가
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        // 로그인된 사용자용 화면들
        <>
          <Stack.Screen
            name="Main"
            component={BottomTabNavigator}
          />
          <Stack.Screen
            name="ParkingFloorPlan"
            component={ParkingFloorPlanScreen}
            options={{
              presentation: 'modal',
              animation: 'slide_from_right',
            }}
          />
        </>
      ) : (
        // 로그인되지 않은 사용자용 화면들
        <Stack.Screen
          name="Auth"
          component={LoginScreen}
        />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;