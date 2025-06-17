import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppStore } from '@/store/store';
import { COLORS, FONT_SIZES } from '@/utils/constants';
import { MainTabParamList } from '@/types';

import HomeScreen from '@/screens/HomeScreen';
import FavoritesScreen from '@/screens/FavoritesScreen';
import MyPageScreen from '@/screens/MyPageScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const BottomTabNavigator: React.FC = () => {
  const { selectedParkingLot } = useAppStore();

  // 주차장 상세정보가 표시될 때 탭바 숨김
  const tabBarStyle = selectedParkingLot 
    ? { display: 'none' as const }
    : {
        backgroundColor: COLORS.background,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
      };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'Favorites':
              iconName = focused ? 'star' : 'star-outline';
              break;
            case 'MyPage':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.text.light,
        tabBarLabelStyle: {
          fontSize: FONT_SIZES.xs,
          fontWeight: '500',
        },
        tabBarStyle,
        headerShown: false,
        lazy: false, // 모든 탭의 상태를 메모리에 유지
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: '탐색',
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: '즐겨찾기',
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPageScreen}
        options={{
          tabBarLabel: '마이페이지',
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;