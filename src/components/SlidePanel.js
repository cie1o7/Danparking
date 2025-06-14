import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SlidePanel = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>주변 주차장</Text>
      </View>
      
      <View style={styles.content}>
        <TouchableOpacity style={styles.parkingItem}>
          <View style={styles.parkingInfo}>
            <Text style={styles.parkingName}>성균관대학교 주차장</Text>
            <Text style={styles.parkingDistance}>350m • 도보 5분</Text>
          </View>
          <View style={styles.parkingPrice}>
            <Text style={styles.priceText}>시간당</Text>
            <Text style={styles.price}>₩3,000</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.parkingItem}>
          <View style={styles.parkingInfo}>
            <Text style={styles.parkingName}>혜화역 공영주차장</Text>
            <Text style={styles.parkingDistance}>500m • 도보 7분</Text>
          </View>
          <View style={styles.parkingPrice}>
            <Text style={styles.priceText}>시간당</Text>
            <Text style={styles.price}>₩2,000</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.parkingItem}>
          <View style={styles.parkingInfo}>
            <Text style={styles.parkingName}>마로니에 주차장</Text>
            <Text style={styles.parkingDistance}>800m • 도보 12분</Text>
          </View>
          <View style={styles.parkingPrice}>
            <Text style={styles.priceText}>시간당</Text>
            <Text style={styles.price}>₩4,000</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  content: {
    padding: 15,
  },
  parkingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 10,
  },
  parkingInfo: {
    flex: 1,
  },
  parkingName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  parkingDistance: {
    fontSize: 14,
    color: '#666',
  },
  parkingPrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 12,
    color: '#666',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
});

export default SlidePanel;