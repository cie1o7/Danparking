import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

const MainMap = () => {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 37.5665,
    longitude: 126.9780,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const parkingLots = [
    {
      id: 1,
      title: '주차장 A',
      description: '2분 거리',
      coordinate: {
        latitude: 37.5665 + 0.001,
        longitude: 126.9780 + 0.001,
      },
    },
    {
      id: 2,
      title: '주차장 B',
      description: '5분 거리',
      coordinate: {
        latitude: 37.5665 - 0.001,
        longitude: 126.9780 + 0.001,
      },
    },
    {
      id: 3,
      title: '주차장 C',
      description: '7분 거리',
      coordinate: {
        latitude: 37.5665,
        longitude: 126.9780 - 0.001,
      },
    },
  ];

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
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
      >
        {parkingLots.map((parking) => (
          <Marker
            key={parking.id}
            coordinate={parking.coordinate}
            title={parking.title}
            description={parking.description}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  },
});

export default MainMap; 