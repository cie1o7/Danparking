import { CongestionInfo, CongestionLevel } from '@/types';

// API 설정
export const API_CONFIG = {
  BASE_URL: 'https://danparking.duckdns.org', 
  TIMEOUT: 10000,
};

// 지도 설정
export const MAP_CONFIG = {
  INITIAL_REGION: {
    latitude: 37.3211, // 단국대 죽전캠퍼스 좌표
    longitude: 127.1267,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  },
  UNIVERSITY_CENTER: {
    latitude: 37.3211,
    longitude: 127.1267,
  },
  UNIVERSITY_RADIUS: 2000, // 2km 반경
  ANIMATION_DURATION: 1000,
};

// 혼잡도 설정
export const CONGESTION_CONFIG: Record<CongestionLevel, CongestionInfo> = {
  available: {
    level: 'available',
    color: '#34C759',
    textColor: '#FFFFFF',
    markerSize: 32,
    label: '여유',
  },
  normal: {
    level: 'normal',
    color: '#FFD60A',
    textColor: '#000000',
    markerSize: 28,
    label: '보통',
  },
  busy: {
    level: 'busy',
    color: '#FF9500',
    textColor: '#FFFFFF',
    markerSize: 24,
    label: '혼잡',
  },
  full: {
    level: 'full',
    color: '#FF3B30',
    textColor: '#FFFFFF',
    markerSize: 20,
    label: '만차',
  },
};

// 색상 팔레트
export const COLORS = {
  primary: '#007AFF',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  border: '#E5E5E5',
  danger: '#FF3B30',
  success: '#34C759',
  shadow: '#000000',
  text: {
    primary: '#000000',
    secondary: '#666666',
    light: '#999999',
  },
};

// 폰트 크기
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
};

// 간격 설정
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
};

// Bottom Sheet 설정
export const BOTTOM_SHEET_CONFIG = {
  SNAP_POINTS: ['25%', '50%', '90%'],
  HANDLE_HEIGHT: 20,
  BORDER_RADIUS: 16,
};

// 애니메이션 설정
export const ANIMATION_CONFIG = {
  timing: {
    duration: 300,
  },
  spring: {
    damping: 15,
    stiffness: 150,
  },
};

// 권한 설정
export const PERMISSIONS = {
  LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
  BACKGROUND_LOCATION: 'android.permission.ACCESS_BACKGROUND_LOCATION',
  RECORD_AUDIO: 'android.permission.RECORD_AUDIO',
};

// 스토리지 키
export const STORAGE_KEYS = {
  ACCESS_TOKEN: '@access_token',
  REFRESH_TOKEN: '@refresh_token',
  AUTH_TOKEN: '@auth_token',
  USER_INFO: '@user_info',
  SEARCH_HISTORY: '@search_history',
  MY_PARKING_LOCATION: '@my_parking_location',
  APP_SETTINGS: '@app_settings',
};

// 검색 설정
export const SEARCH_CONFIG = {
  MAX_HISTORY_ITEMS: 10,
  MIN_QUERY_LENGTH: 2,
  MIN_SEARCH_LENGTH: 2,
  DEBOUNCE_DELAY: 300,
};

// 위치 추적 설정
export const LOCATION_CONFIG = {
  ACCURACY: 'high',
  UPDATE_INTERVAL: 30000, // 30초
  DISTANCE_FILTER: 50, // 50m
  BACKGROUND_MODE: 'location',
};

// 혼잡도 계산 함수
export const calculateCongestionLevel = (availableSlots: number, totalSlots: number): CongestionLevel => {
  if (totalSlots === 0) return 'full';
  
  const occupancyRate = ((totalSlots - availableSlots) / totalSlots) * 100;
  
  if (occupancyRate >= 90) return 'full';
  if (occupancyRate >= 70) return 'busy';
  if (occupancyRate >= 40) return 'normal';
  return 'available';
};

// 거리 계산 함수
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // 지구 반지름 (km)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // 미터 단위로 반환
};

const toRad = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

// 시간 포맷팅 함수
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// 에러 메시지
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
  UNAUTHORIZED: '로그인이 필요합니다.',
  FORBIDDEN: '접근 권한이 없습니다.',
  NOT_FOUND: '요청한 데이터를 찾을 수 없습니다.',
  SERVER_ERROR: '서버 오류가 발생했습니다.',
  VALIDATION_ERROR: '입력 정보를 확인해주세요.',
  LOCATION_PERMISSION_DENIED: '위치 권한이 필요합니다.',
  LOCATION_SERVICE_DISABLED: '위치 서비스를 활성화해주세요.',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
};

// 성공 메시지
export const SUCCESS_MESSAGES = {
  PARKING_CLEARED: '주차 위치가 삭제되었습니다.',
  FAVORITE_ADDED: '즐겨찾기에 추가되었습니다.',
  FAVORITE_REMOVED: '즐겨찾기에서 제거되었습니다.',
  PARKING_SAVED: '주차 위치가 저장되었습니다.',
  LOGIN_SUCCESS: '로그인되었습니다.',
};