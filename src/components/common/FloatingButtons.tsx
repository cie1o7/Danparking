import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppStore } from '@/store/store';
import { COLORS, FONT_SIZES, SPACING, CONGESTION_CONFIG } from '@/utils/constants';
import { CongestionLevel } from '@/types';

interface FloatingButtonsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onLocationPress: () => void;
  bottomSheetIndex: number;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const FloatingButtons: React.FC<FloatingButtonsProps> = ({
  onZoomIn,
  onZoomOut,
  onLocationPress,
  bottomSheetIndex,
}) => {
  const { selectedFilter } = useAppStore();

  // 범례 데이터
  const legendItems = [
    { level: 'available' as CongestionLevel, label: '여유' },
    { level: 'normal' as CongestionLevel, label: '보통' },
    { level: 'busy' as CongestionLevel, label: '혼잡' },
    { level: 'full' as CongestionLevel, label: '만차' },
  ];

  const getLocationButtonPosition = () => {
    switch (bottomSheetIndex) {
      case 0: // 숨겨짐 - 지도 하단
        return { bottom: SPACING.lg };
      case 1: // 50% - 패널 위
        return { bottom: SCREEN_HEIGHT * 0.52 };
      case 2: // 90% - 숨김
        return { bottom: -100 };
      default:
        return { bottom: SPACING.lg };
    }
  };

  return (
    <>
      {/* 확대/축소 버튼 */}
      <View style={styles.zoomButtons}>
        <TouchableOpacity style={styles.zoomButton} onPress={onZoomIn}>
          <Icon name="add" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomButton} onPress={onZoomOut}>
          <Icon name="remove" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
      </View>

      {/* 혼잡도 범례 */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>혼잡도</Text>
        {legendItems.map((item) => {
          const congestionInfo = CONGESTION_CONFIG[item.level];
          return (
            <View key={item.level} style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: congestionInfo.color },
                ]}
              />
              <Text style={styles.legendLabel}>{item.label}</Text>
            </View>
          );
        })}
      </View>

      {/* 내 위치 버튼 */}
      <TouchableOpacity
        style={[styles.locationButton, getLocationButtonPosition()]}
        onPress={onLocationPress}
      >
        <Icon name="locate" size={24} color={COLORS.primary} />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  zoomButtons: {
    position: 'absolute',
    right: SPACING.md,
    top: SPACING.xl,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  zoomButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  legend: {
    position: 'absolute',
    right: SPACING.md,
    top: 140,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: SPACING.sm,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 80,
  },
  legendTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.xs,
  },
  legendLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.secondary,
    minWidth: 30,
  },
  locationButton: {
    position: 'absolute',
    right: SPACING.md,
    width: 44,
    height: 44,
    backgroundColor: COLORS.background,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default FloatingButtons;