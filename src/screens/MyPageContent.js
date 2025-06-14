import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function MyPageContent() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>마이페이지</Text>
        <Text style={styles.subtitle}>내 정보 관리</Text>
        {/* 마이페이지 내용 */}
        <View style={styles.menuList}>
          <Text>👤 프로필 정보</Text>
          <Text>🚗 내 차량 관리</Text>
          <Text>📝 이용 내역</Text>
          <Text>⚙️ 설정</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  menuList: {
    gap: 10,
  },
});

