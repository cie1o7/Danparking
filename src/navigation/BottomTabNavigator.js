import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeContent from '../screens/HomeContent';
import FavoriteContent from '../screens/FavoriteContent';
import MyPageContent from '../screens/MyPageContent';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // 헤더 숨김
        tabBarStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
          borderTopWidth: 0,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === '홈') {
            iconName = 'home-outline';
          } else if (route.name === '즐겨찾기') {
            iconName = 'heart-outline';
          } else if (route.name === '마이페이지') {
            iconName = 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="홈" component={HomeContent} />
      <Tab.Screen name="즐겨찾기" component={FavoriteContent} />
      <Tab.Screen name="마이페이지" component={MyPageContent} />
    </Tab.Navigator>
  );
}