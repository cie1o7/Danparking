import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQuery } from '@tanstack/react-query';
import { parkingService } from '@/services/parking';
import { 
  COLORS, 
  FONT_SIZES, 
  SPACING,
  CONGESTION_CONFIG 
} from '@/utils/constants';
import { RootStackParamList, ParkingSlot } from '@/types';

type ParkingFloorPlanRouteProp = RouteProp<RootStackParamList, 'ParkingFloorPlan'>;
type ParkingFloorPlanNavigationProp = StackNavigationProp<RootStackParamList>;

const { width: screenWidth } = Dimensions.get('window');

const ParkingFloorPlanScreen: React.FC = () => {
  const route = useRoute<ParkingFloorPlanRouteProp>();
  const navigation = useNavigation<ParkingFloorPlanNavigationProp>();
  
  const { parkingLotId, parkingLotName } = route.params;

  // 주차장 슬롯 데이터 조회
  const { data: parkingSlots = [], isLoading } = useQuery({
    queryKey: ['parkingSlots', parkingLotId],
    queryFn: () => parkingService.getParkingSlotsByParkingLotId(parkingLotId),
    refetchInterval: 30000, // 30초마다 자동 갱신
  });

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Icon name="arrow-back" size={24} color={COLORS.text.primary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{parkingLotName}</Text>
      <View style={styles.placeholder} />
    </View>
  );

  const renderTitle = () => (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>주차장 평면도</Text>
      <Text style={styles.subtitle}>실시간 주차 현황을 확인하세요</Text>
    </View>
  );

  const renderLegend = () => (
    <View style={styles.legendContainer}>
      <Text style={styles.legendTitle}>범례</Text>
      <View style={styles.legendItems}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSpot, styles.availableSpot]} />
          <Text style={styles.legendText}>주차 가능</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSpot, styles.occupiedSpot]} />
          <Text style={styles.legendText}>주차 중</Text>
        </View>
      </View>
    </View>
  );

  const renderParkingLayout = () => {
    // 주차자리를 행별로 그룹화 (예: 10개씩 한 행)
    const slotsPerRow = 10;
    const rows = [];
    
    for (let i = 0; i < parkingSlots.length; i += slotsPerRow) {
      rows.push(parkingSlots.slice(i, i + slotsPerRow));
    }

    return (
      <View style={styles.parkingLayout}>
        {/* 입구 표시 */}
        <View style={styles.entranceContainer}>
          <Text style={styles.entranceLabel}>입구</Text>
          <Icon name="arrow-down" size={24} color={COLORS.primary} />
        </View>

        {/* 주차자리 그리드 */}
        <View style={styles.parkingGrid}>
          {rows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.parkingRow}>
              {row.map((slot) => (
                <View
                  key={slot.slotId}
                  style={[
                    styles.parkingSpot,
                    slot.isAvailable ? styles.availableSpot : styles.occupiedSpot,
                  ]}
                >
                  <Text
                    style={[
                      styles.spotNumber,
                      slot.isAvailable ? styles.availableSpotText : styles.occupiedSpotText,
                    ]}
                  >
                    {slot.slotNumber}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* 출구 표시 */}
        <View style={styles.exitContainer}>
          <Icon name="arrow-up" size={24} color={COLORS.primary} />
          <Text style={styles.exitLabel}>출구</Text>
        </View>
      </View>
    );
  };

  const renderStats = () => {
    const totalSlots = parkingSlots.length;
    const availableSlots = parkingSlots.filter(slot => slot.isAvailable).length;
    const occupiedSlots = totalSlots - availableSlots;
    const occupancyRate = totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0;

    return (
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>주차 현황</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalSlots}</Text>
            <Text style={styles.statLabel}>전체</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: COLORS.success }]}>
              {availableSlots}
            </Text>
            <Text style={styles.statLabel}>주차 가능</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: COLORS.danger }]}>
              {occupiedSlots}
            </Text>
            <Text style={styles.statLabel}>주차 중</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{occupancyRate}%</Text>
            <Text style={styles.statLabel}>점유율</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderTitle()}
        {renderLegend()}
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>평면도를 불러오는 중...</Text>
          </View>
        ) : (
          <>
            {renderParkingLayout()}
            {renderStats()}
          </>
        )}
        
        {/* 하단 여백 */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
  },
  legendContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  legendTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendSpot: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  legendText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },
  parkingLayout: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  entranceContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  entranceLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  parkingGrid: {
    alignItems: 'center',
  },
  parkingRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  parkingSpot: {
    width: 28,
    height: 28,
    marginHorizontal: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  availableSpot: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  occupiedSpot: {
    backgroundColor: COLORS.danger,
    borderColor: COLORS.danger,
  },
  spotNumber: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  availableSpotText: {
    color: COLORS.background,
  },
  occupiedSpotText: {
    color: COLORS.background,
  },
  exitContainer: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  exitLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
  statsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  statsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },
  loadingContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
  },
  bottomSpacing: {
    height: SPACING.xl,
  },
});

export default ParkingFloorPlanScreen;