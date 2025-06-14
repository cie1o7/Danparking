// src/components/MapBackground.js
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

export default function MapBackground() {
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isFollowingUser, setIsFollowingUser] = useState(false);

  useEffect(() => {
    let locationSubscription;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('위치 권한 거부됨');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);

      mapRef.current?.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 5,
        },
        (newLocationData) => {
          const newLocation = {
            latitude: newLocationData.coords.latitude,
            longitude: newLocationData.coords.longitude,
          };
          
          setUserLocation(newLocation);

          if (isFollowingUser) {
            mapRef.current?.animateToRegion({
              latitude: newLocation.latitude,
              longitude: newLocation.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }, 800);
          }
        }
      );
    })();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [isFollowingUser]);

  const handleLocationPress = () => {
    if (userLocation) {
      if (isFollowingUser) {
        setIsFollowingUser(false);
      } else {
        setIsFollowingUser(true);
        mapRef.current?.animateToRegion({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }, 1000);
      }
    }
  };

  const handleRegionChangeComplete = () => {
    if (isFollowingUser) {
      setIsFollowingUser(false);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsUserLocation={true}
        showsMyLocationButton={false}
        followsUserLocation={false}
        showsCompass={true}
        showsScale={true}
        showsTraffic={false}
        showsBuildings={true}
        showsIndoors={true}
        toolbarEnabled={true}
        loadingEnabled={true}
        moveOnMarkerPress={true}
        rotateEnabled={true}
        scrollEnabled={true}
        zoomEnabled={true}
        zoomControlEnabled={true}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="현재 위치"
          />
        )}
      </MapView>

      <TouchableOpacity
        style={[
          styles.locationButton,
          { backgroundColor: isFollowingUser ? '#007AFF' : '#fff' }
        ]}
        onPress={handleLocationPress}
      >
        <Ionicons 
          name="locate" 
          size={24} 
          color={isFollowingUser ? '#fff' : '#007AFF'} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  },
  locationButton: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});