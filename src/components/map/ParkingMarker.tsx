import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { ParkingLot, CongestionLevel } from '@/types';
import { CONGESTION_CONFIG, calculateCongestionLevel, COLORS } from '@/utils/constants';

interface ParkingMarkerProps {
  parkingLot: ParkingLot;
  onPress: (parkingLot: ParkingLot) => void;
}

const ParkingMarker: React.FC<ParkingMarkerProps> = ({ parkingLot, onPress }) => {
  const congestionLevel = calculateCongestionLevel(
    parkingLot.availableSlots,
    parkingLot.totalSlots
  );
  
  const congestionInfo = CONGESTION_CONFIG[congestionLevel];

  return (
    <Marker
      coordinate={{
        latitude: parkingLot.latitude,
        longitude: parkingLot.longitude,
      }}
      onPress={() => onPress(parkingLot)}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <View
        style={[
          styles.markerContainer,
          {
            width: congestionInfo.markerSize,
            height: congestionInfo.markerSize,
            backgroundColor: congestionInfo.color,
          },
        ]}
      >
        <Text
          style={[
            styles.markerText,
            {
              color: congestionInfo.textColor,
              fontSize: Math.max(8, congestionInfo.markerSize * 0.35),
            },
          ]}
        >
          {parkingLot.availableSlots}
        </Text>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ParkingMarker;