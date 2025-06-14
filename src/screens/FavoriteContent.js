import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function FavoriteContent() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>즐겨찾기</Text>
        <Text style={styles.subtitle}>자주 찾는 주차장</Text>
        {/* 즐겨찾기 내용 */}
        <View style={styles.favoriteList}>
          <Text>⭐ 즐겨찾기 주차장 1</Text>
          <Text>⭐ 즐겨찾기 주차장 2</Text>
          <Text>⭐ 즐겨찾기 주차장 3</Text>
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
  favoriteList: {
    gap: 10,
  },
});