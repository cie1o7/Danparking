import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const HomePanel = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>주변 주차장 정보</Text>
      <View style={styles.parkingList}>
        <TouchableOpacity style={styles.parkingItem}>
          <Text style={styles.parkingTitle}>🅿️ 주차장 A</Text>
          <Text style={styles.parkingInfo}>2분 거리 • 시간당 3,000원</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.parkingItem}>
          <Text style={styles.parkingTitle}>🅿️ 주차장 B</Text>
          <Text style={styles.parkingInfo}>5분 거리 • 시간당 2,000원</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.parkingItem}>
          <Text style={styles.parkingTitle}>🅿️ 주차장 C</Text>
          <Text style={styles.parkingInfo}>7분 거리 • 시간당 4,000원</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  parkingList: {
    gap: 15,
  },
  parkingItem: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  parkingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  parkingInfo: {
    color: '#666',
  },
});

export default HomePanel; 