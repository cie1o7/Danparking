import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import MapView, { Region } from 'react-native-maps';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Geolocation from '@react-native-community/geolocation';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import SearchBar from '@/components/common/SearchBar';
import FilterButtons from '@/components/common/FilterButtons';
import FloatingButtons from '@/components/common/FloatingButtons';
import ParkingMarker from '@/components/map/ParkingMarker';
import ParkingDetailCard from '@/components/panel/ParkingDetailCard';

import { useAppStore, selectParkingLotAndFocus, resetFilters } from '@/store/store';
import { parkingService } from '@/services/parking';
import { 
  MAP_CONFIG, 
  BOTTOM_SHEET_CONFIG, 
  COLORS,
  ERROR_MESSAGES,
  calculateDistance 
} from '@/utils/constants';
import { ParkingLot, Region as AppRegion, RootStackParamList } from '@/types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  
  const [mapRegion, setMapRegion] = useState<Region>(MAP_CONFIG.INITIAL_REGION);

  const {
    selectedParkingLot,
    selectedFilter,
    bottomSheetIndex,
    setBottomSheetIndex,
  } = useAppStore();

  // 주차장 데이터 조회
  const { data: parkingLots = [], isLoading } = useQuery({
    queryKey: ['parkingLots'],
    queryFn: parkingService.getAllParkingLots,
    staleTime: 60000, // 1분
  });

  // 즐겨찾기 데이터 조회
  const { data: favoriteParkingLots = [] } = useQuery({
    queryKey: ['favoriteParkingLots'],
    queryFn: parkingService.getFavoriteParkingLots,
  });

  // 필터링된 주차장 목록
  const filteredParkingLots = React.useMemo(() => {
    let filtered = parkingLots;

    switch (selectedFilter) {
      case 'favorites':
        const favoriteIds = favoriteParkingLots.map(fav => fav.parkingLotId);
        filtered = parkingLots.filter(lot => favoriteIds.includes(lot.parkingLotId));
        break;
      case 'available':
        filtered = parkingLots.filter(lot => lot.availableSlots / lot.totalSlots > 0.5);
        break;
      case 'normal':
        filtered = parkingLots.filter(lot => {
          const ratio = lot.availableSlots / lot.totalSlots;
          return ratio > 0.2 && ratio <= 0.5;
        });
        break;
      case 'busy':
        filtered = parkingLots.filter(lot => {
          const ratio = lot.availableSlots / lot.totalSlots;
          return ratio > 0 && ratio <= 0.2;
        });
        break;
      case 'full':
        filtered = parkingLots.filter(lot => lot.availableSlots === 0);
        break;
      default:
        filtered = parkingLots;
    }

    return filtered;
  }, [parkingLots, favoriteParkingLots, selectedFilter]);

  // 컴포넌트 마운트 시 위치 권한 요청 및 현재 위치 조회
  useEffect(() => {
    requestLocationPermission();
    resetFilters(); // 탐색 탭 진입 시 필터 상태 초기화
  }, []);

  // 선택된 주차장이 변경되면 지도 이동
  useEffect(() => {
    if (selectedParkingLot && mapRef.current) {
      const latitude = selectedParkingLot.latitude || MAP_CONFIG.UNIVERSITY_CENTER.latitude;
      const longitude = selectedParkingLot.longitude || MAP_CONFIG.UNIVERSITY_CENTER.longitude;
      
      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        MAP_CONFIG.ANIMATION_DURATION
      );
    }
  }, [selectedParkingLot]);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: '위치 권한 요청',
            message: '주차장 정보를 정확히 제공하기 위해 위치 권한이 필요합니다.',
            buttonNeutral: '나중에',
            buttonNegative: '거부',
            buttonPositive: '허용',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
      },
      (error) => {
        console.log('Location error:', error);
        Alert.alert('위치 오류', ERROR_MESSAGES.LOCATION_SERVICE_DISABLED);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  const handleZoomIn = () => {
    mapRef.current?.animateToRegion({
      ...mapRegion,
      latitudeDelta: mapRegion.latitudeDelta * 0.5,
      longitudeDelta: mapRegion.longitudeDelta * 0.5,
    });
  };

  const handleZoomOut = () => {
    mapRef.current?.animateToRegion({
      ...mapRegion,
      latitudeDelta: mapRegion.latitudeDelta * 2,
      longitudeDelta: mapRegion.longitudeDelta * 2,
    });
  };

  const handleLocationPress = () => {
    if (currentLocation) {
      mapRef.current?.animateToRegion({
        ...currentLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } else {
      getCurrentLocation();
    }
  };

  const handleParkingLotSelect = (parkingLot: ParkingLot) => {
    selectParkingLotAndFocus(parkingLot);
  };

  const handleFloorPlanPress = () => {
    if (selectedParkingLot) {
      navigation.navigate('ParkingFloorPlan', {
        parkingLotId: selectedParkingLot.parkingLotId,
        parkingLotName: selectedParkingLot.name,
      });
    }
  };

  const handleBottomSheetChange = (index: number) => {
    setBottomSheetIndex(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 검색창 */}
      <SearchBar onParkingLotSelect={handleParkingLotSelect} />
      
      {/* 필터 버튼들 */}
      <FilterButtons />

      {/* 지도 */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={MAP_CONFIG.INITIAL_REGION}
          onRegionChangeComplete={setMapRegion}
          showsUserLocation={!!currentLocation}
          showsMyLocationButton={false}
          showsCompass={false}
          showsScale={false}
          loadingEnabled={true}
        >
          {/* 주차장 마커들 */}
          {filteredParkingLots.map((parkingLot) => (
            <ParkingMarker
              key={parkingLot.parkingLotId}
              parkingLot={parkingLot}
              onPress={handleParkingLotSelect}
            />
          ))}
        </MapView>

        {/* 플로팅 버튼들 */}
        <FloatingButtons
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onLocationPress={handleLocationPress}
          bottomSheetIndex={bottomSheetIndex}
        />
      </View>

      {/* 하단 슬라이딩 패널 */}
      <BottomSheet
        ref={bottomSheetRef}
        index={bottomSheetIndex}
        snapPoints={BOTTOM_SHEET_CONFIG.SNAP_POINTS}
        onChange={handleBottomSheetChange}
        enablePanDownToClose={false}
        handleHeight={BOTTOM_SHEET_CONFIG.HANDLE_HEIGHT}
        handleStyle={styles.bottomSheetHandle}
        backgroundStyle={styles.bottomSheetBackground}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          {selectedParkingLot ? (
            <ParkingDetailCard
              parkingLot={selectedParkingLot}
              onFloorPlanPress={handleFloorPlanPress}
            />
          ) : (
            <View style={styles.emptyPanel}>
              {/* 빈 패널 또는 기본 정보 표시 */}
            </View>
          )}
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  bottomSheetHandle: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BOTTOM_SHEET_CONFIG.BORDER_RADIUS,
    borderTopRightRadius: BOTTOM_SHEET_CONFIG.BORDER_RADIUS,
  },
  bottomSheetBackground: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BOTTOM_SHEET_CONFIG.BORDER_RADIUS,
    borderTopRightRadius: BOTTOM_SHEET_CONFIG.BORDER_RADIUS,
  },
  bottomSheetContent: {
    flex: 1,
  },
  emptyPanel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;