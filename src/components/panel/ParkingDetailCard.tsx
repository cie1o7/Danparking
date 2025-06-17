import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { parkingService } from '@/services/parking';
import { ParkingLot } from '@/types';
import { 
  COLORS, 
  FONT_SIZES, 
  SPACING, 
  CONGESTION_CONFIG, 
  calculateCongestionLevel,
  SUCCESS_MESSAGES 
} from '@/utils/constants';

interface ParkingDetailCardProps {
  parkingLot: ParkingLot;
  onFloorPlanPress: () => void;
}

const ParkingDetailCard: React.FC<ParkingDetailCardProps> = ({
  parkingLot,
  onFloorPlanPress,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const queryClient = useQueryClient();

  // 즐겨찾기 목록 조회
  const { data: favoriteParkingLots = [] } = useQuery({
    queryKey: ['favoriteParkingLots'],
    queryFn: parkingService.getFavoriteParkingLots,
  });

  // 현재 주차장이 즐겨찾기에 있는지 확인
  React.useEffect(() => {
    const favorite = favoriteParkingLots.find(
      (fav) => fav.parkingLotId === parkingLot.parkingLotId
    );
    setIsFavorite(!!favorite);
  }, [favoriteParkingLots, parkingLot.parkingLotId]);

  // 즐겨찾기 추가 뮤테이션
  const addFavoriteMutation = useMutation({
    mutationFn: (parkingLotId: number) => parkingService.addFavoriteParkingLot(parkingLotId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favoriteParkingLots'] });
      Toast.show({
        type: 'success',
        text1: SUCCESS_MESSAGES.FAVORITE_ADDED,
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: '즐겨찾기 추가 실패',
        text2: error.message,
      });
    },
  });

  // 즐겨찾기 제거 뮤테이션
  const removeFavoriteMutation = useMutation({
    mutationFn: (favoriteParkingLotId: number) => 
      parkingService.removeFavoriteParkingLot(favoriteParkingLotId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favoriteParkingLots'] });
      Toast.show({
        type: 'success',
        text1: SUCCESS_MESSAGES.FAVORITE_REMOVED,
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: '즐겨찾기 제거 실패',
        text2: error.message,
      });
    },
  });

  // 주차 완료 뮤테이션
  const saveParkingMutation = useMutation({
    mutationFn: () => parkingService.saveMyParkingLocation({
      parkingLotId: parkingLot.parkingLotId,
      parkingLotName: parkingLot.name,
      location: parkingLot.location,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myParkingLocation'] });
      Toast.show({
        type: 'success',
        text1: SUCCESS_MESSAGES.PARKING_SAVED,
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: '주차 위치 저장 실패',
        text2: error.message,
      });
    },
  });

  const congestionLevel = calculateCongestionLevel(
    parkingLot.availableSlots,
    parkingLot.totalSlots
  );
  const congestionInfo = CONGESTION_CONFIG[congestionLevel];

  const handleFavoritePress = () => {
    if (isFavorite) {
      // 즐겨찾기 제거
      const favorite = favoriteParkingLots.find(
        (fav) => fav.parkingLotId === parkingLot.parkingLotId
      );
      if (favorite) {
        removeFavoriteMutation.mutate(favorite.id);
      }
    } else {
      // 즐겨찾기 추가
      addFavoriteMutation.mutate(parkingLot.parkingLotId);
    }
  };

  const handleNavigationPress = () => {
    // 기본 지도 앱으로 길찾기
    const url = `geo:${parkingLot.latitude || 37.3211},${parkingLot.longitude || 127.1267}?q=${encodeURIComponent(parkingLot.name)}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          // 구글 맵스 웹으로 대체
          const webUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parkingLot.name)}`;
          Linking.openURL(webUrl);
        }
      })
      .catch(() => {
        Toast.show({
          type: 'error',
          text1: '길찾기 앱을 열 수 없습니다.',
        });
      });
  };

  const handleParkingComplete = () => {
    Alert.alert(
      '주차 완료',
      '현재 위치를 주차 위치로 저장하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '저장',
          onPress: () => saveParkingMutation.mutate(),
        },
      ]
    );
  };

  const getCongestionStatusText = () => {
    switch (congestionLevel) {
      case 'available':
        return '여유';
      case 'normal':
        return '보통';
      case 'busy':
        return '혼잡';
      case 'full':
        return '만차';
      default:
        return '알 수 없음';
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{parkingLot.name}</Text>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavoritePress}
            disabled={addFavoriteMutation.isPending || removeFavoriteMutation.isPending}
          >
            <Icon
              name={isFavorite ? 'star' : 'star-outline'}
              size={24}
              color={isFavorite ? COLORS.warning : COLORS.text.light}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: congestionInfo.color },
            ]}
          >
            <Text style={styles.statusText}>{getCongestionStatusText()}</Text>
          </View>
          <Text style={styles.availabilityText}>
            잔여 {parkingLot.availableSlots}석 / 전체 {parkingLot.totalSlots}석
          </Text>
        </View>

        <Text style={styles.address}>{parkingLot.location}</Text>
      </View>

      {/* 버튼들 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.navigationButton]}
          onPress={handleNavigationPress}
        >
          <Icon name="navigate-outline" size={20} color={COLORS.background} />
          <Text style={styles.navigationButtonText}>길찾기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.floorPlanButton]}
          onPress={onFloorPlanPress}
        >
          <Icon name="map-outline" size={20} color={COLORS.primary} />
          <Text style={styles.floorPlanButtonText}>평면도 보기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.parkingCompleteButton]}
          onPress={handleParkingComplete}
          disabled={saveParkingMutation.isPending}
        >
          <Icon name="car-outline" size={20} color={COLORS.background} />
          <Text style={styles.parkingCompleteButtonText}>
            {saveParkingMutation.isPending ? '저장 중...' : '주차 완료'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  title: {
    flex: 1,
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  favoriteButton: {
    padding: SPACING.xs,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    marginRight: SPACING.sm,
  },
  statusText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.background,
  },
  availabilityText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  address: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  buttonContainer: {
    gap: SPACING.sm,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: 8,
    gap: SPACING.sm,
  },
  navigationButton: {
    backgroundColor: COLORS.primary,
  },
  navigationButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.background,
  },
  floorPlanButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  floorPlanButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.primary,
  },
  parkingCompleteButton: {
    backgroundColor: COLORS.success,
  },
  parkingCompleteButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.background,
  },
});

export default ParkingDetailCard;