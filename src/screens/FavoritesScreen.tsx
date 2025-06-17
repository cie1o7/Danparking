import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import MapView, { Region } from 'react-native-maps';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import SearchBar from '@/components/common/SearchBar';
import FloatingButtons from '@/components/common/FloatingButtons';
import ParkingMarker from '@/components/map/ParkingMarker';
import ParkingDetailCard from '@/components/panel/ParkingDetailCard';

import { useAppStore, selectParkingLotAndFocus } from '@/store/store';
import { parkingService } from '@/services/parking';
import { 
  MAP_CONFIG, 
  BOTTOM_SHEET_CONFIG, 
  COLORS,
  FONT_SIZES,
  SPACING,
  calculateCongestionLevel
} from '@/utils/constants';
import { ParkingLot, RootStackParamList } from '@/types';

type FavoritesScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [mapRegion, setMapRegion] = useState<Region>(MAP_CONFIG.INITIAL_REGION);

  const {
    selectedParkingLot,
    bottomSheetIndex,
    setBottomSheetIndex,
  } = useAppStore();

  // 즐겨찾기 주차장 데이터 조회
  const { data: favoriteParkingLots = [], isLoading } = useQuery({
    queryKey: ['favoriteParkingLots'],
    queryFn: parkingService.getFavoriteParkingLots,
  });

  // 전체 주차장 데이터 조회 (즐겨찾기의 최신 정보를 위해)
  const { data: allParkingLots = [] } = useQuery({
    queryKey: ['parkingLots'],
    queryFn: parkingService.getAllParkingLots,
  });

  // 즐겨찾기 주차장의 최신 정보 조합
  const favoriteLotsWithLatestInfo: ParkingLot[] = React.useMemo(() => {
    return favoriteParkingLots.map(favorite => {
      const latestInfo = allParkingLots.find(
        lot => lot.parkingLotId === favorite.parkingLotId
      );
      return latestInfo || {
        parkingLotId: favorite.parkingLotId,
        id: favorite.parkingLotId,
        name: favorite.name,
        location: favorite.location,
        address: favorite.location,
        latitude: 0,
        longitude: 0,
        totalSlots: favorite.totalSlots,
        availableSlots: favorite.availableSlots,
        congestionLevel: calculateCongestionLevel(favorite.availableSlots, favorite.totalSlots),
        isFavorite: true
      };
    });
  }, [favoriteParkingLots, allParkingLots]);

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
    mapRef.current?.animateToRegion(MAP_CONFIG.INITIAL_REGION);
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

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>즐겨찾기한 주차장이 없습니다</Text>
      <Text style={styles.emptyDescription}>
        자주 이용하는 주차장을 즐겨찾기에 추가해보세요
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 검색창 */}
      <SearchBar onParkingLotSelect={handleParkingLotSelect} />

      {favoriteLotsWithLatestInfo.length > 0 ? (
        <>
          {/* 지도 */}
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={MAP_CONFIG.INITIAL_REGION}
              onRegionChangeComplete={setMapRegion}
              showsUserLocation={false}
              showsMyLocationButton={false}
              showsCompass={false}
              showsScale={false}
              loadingEnabled={true}
            >
              {/* 즐겨찾기 주차장 마커들 */}
              {favoriteLotsWithLatestInfo.map((parkingLot) => (
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
            index={1} // 즐겨찾기 탭에서는 기본 50%로 시작
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
                <View style={styles.favoritesList}>
                  <Text style={styles.favoritesTitle}>즐겨찾기 주차장</Text>
                  {favoriteLotsWithLatestInfo.map((parkingLot) => (
                    <TouchableOpacity
                      key={parkingLot.parkingLotId}
                      style={styles.favoriteItem}
                      onPress={() => handleParkingLotSelect(parkingLot)}
                    >
                      <View style={styles.favoriteItemContent}>
                        <Text style={styles.favoriteItemName}>{parkingLot.name}</Text>
                        <Text style={styles.favoriteItemAvailability}>
                          잔여 {parkingLot.availableSlots}석 / 전체 {parkingLot.totalSlots}석
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </BottomSheetView>
          </BottomSheet>
        </>
      ) : (
        renderEmptyState()
      )}
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
  favoritesList: {
    padding: SPACING.lg,
  },
  favoritesTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
  },
  favoriteItem: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  favoriteItemContent: {
    flex: 1,
  },
  favoriteItemName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  favoriteItemAvailability: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default FavoritesScreen;