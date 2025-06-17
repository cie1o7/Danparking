import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { parkingService } from '@/services/parking';
import { 
  COLORS, 
  FONT_SIZES, 
  SPACING,
  SUCCESS_MESSAGES,
  formatTime 
} from '@/utils/constants';
import { MyParkingLocation, User } from '@/types';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

const MyPageScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();

  // 내 주차 위치 조회
  const { data: myParkingLocation, isLoading: isParkingLoading }: UseQueryResult<MyParkingLocation, Error> = useQuery({
    queryKey: ['myParkingLocation'] as const,
    queryFn: parkingService.getMyParkingLocation,
  });

  // 주차 위치 삭제 뮤테이션
  const clearParkingMutation = useMutation({
    mutationFn: parkingService.clearMyParkingLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myParkingLocation'] });
      Toast.show({
        type: 'success',
        text1: SUCCESS_MESSAGES.PARKING_CLEARED,
      });
    },
    onError: (error: Error) => {
      Toast.show({
        type: 'error',
        text1: '주차 위치 삭제 실패',
        text2: error.message,
      });
    },
  });

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const handleClearParking = () => {
    Alert.alert(
      '주차 위치 삭제',
      '저장된 주차 위치를 삭제하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => clearParkingMutation.mutate(),
        },
      ]
    );
  };

  const handleParkingLocationPress = () => {
    Toast.show({
      type: 'info',
      text1: '주차 위치로 이동',
      text2: '탐색 탭에서 주차 위치를 확인할 수 있습니다.',
    });
  };

  const handleMenuItem = (item: string) => {
    Toast.show({
      type: 'info',
      text1: `${item} 기능`,
      text2: '추후 구현 예정입니다.',
    });
  };

  const renderUserSection = () => (
    <View style={styles.userSection}>
      <View style={styles.avatar}>
        <Icon name="person" size={32} color={COLORS.background} />
      </View>
      <View style={styles.userDetails}>
        <Text style={styles.userName}>{user?.name || '사용자'}</Text>
        <Text style={styles.userEmail}>{user?.email || ''}</Text>
      </View>
      <TouchableOpacity 
        style={styles.settingsButton}
        onPress={() => handleMenuItem('설정')}
      >
        <Icon name="settings-outline" size={24} color={COLORS.text.secondary} />
      </TouchableOpacity>
    </View>
  );

  const renderParkingSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>내 주차 위치</Text>
      
      {isParkingLoading ? (
        <View style={styles.loadingCard}>
          <Text style={styles.loadingText}>로딩 중...</Text>
        </View>
      ) : myParkingLocation ? (
        <TouchableOpacity 
          style={styles.parkingCard}
          onPress={handleParkingLocationPress}
        >
          <Icon name="car" size={24} color={COLORS.primary} />
          <View style={styles.parkingInfo}>
            <Text style={styles.parkingName}>
              {myParkingLocation.parkingLotName}
            </Text>
            <Text style={styles.parkingLocation}>
              {myParkingLocation.location}
            </Text>
            <Text style={styles.parkingTime}>
              {formatTime(myParkingLocation.parkedAt)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleClearParking}
            disabled={clearParkingMutation.isPending}
          >
            <Icon name="trash-outline" size={20} color={COLORS.danger} />
          </TouchableOpacity>
        </TouchableOpacity>
      ) : (
        <View style={styles.noParkingCard}>
          <Icon name="car-outline" size={32} color={COLORS.text.light} />
          <Text style={styles.noParkingText}>저장된 주차 위치가 없습니다</Text>
          <Text style={styles.noParkingSubtext}>
            주차 완료 버튼을 누르면 현재 위치가 저장됩니다
          </Text>
        </View>
      )}
    </View>
  );

  const renderMenuSection = () => {
    const menuItems: MenuItem[] = [
      { id: 'notifications', label: '알림 설정', icon: 'notifications-outline' },
      { id: 'privacy', label: '개인정보 처리방침', icon: 'shield-outline' },
      { id: 'terms', label: '이용약관', icon: 'document-text-outline' },
      { id: 'support', label: '고객센터', icon: 'help-circle-outline' },
      { id: 'version', label: '버전 정보', icon: 'information-circle-outline' },
    ];

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>설정</Text>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => handleMenuItem(item.label)}
          >
            <Icon name={item.icon} size={24} color={COLORS.text.secondary} />
            <Text style={styles.menuItemText}>{item.label}</Text>
            <Icon name="chevron-forward" size={20} color={COLORS.text.light} />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderUserSection()}
        {renderParkingSection()}
        {renderMenuSection()}
        
        {/* 로그아웃 버튼 */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out-outline" size={24} color={COLORS.danger} />
          <Text style={styles.logoutButtonText}>로그아웃</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.sm,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },
  settingsButton: {
    padding: SPACING.sm,
  },
  section: {
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text.primary,
    padding: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  loadingCard: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
  },
  parkingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  parkingInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  parkingName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  parkingLocation: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  parkingTime: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.light,
  },
  deleteButton: {
    padding: SPACING.sm,
  },
  noParkingCard: {
    alignItems: 'center',
    padding: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  noParkingText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  noParkingSubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.light,
    textAlign: 'center',
    lineHeight: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  menuItemText: {
    flex: 1,
    marginLeft: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    margin: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  logoutButtonText: {
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.danger,
  },
});

export default MyPageScreen; 