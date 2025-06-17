// 인증 관련 타입
export interface User {
  userId: number;
  email: string;
  name: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

// 주차장 관련 타입
export interface ParkingLot {
  parkingLotId: number;
  id: number;
  name: string;
  location: string;
  address: string;
  latitude: number;
  longitude: number;
  totalSlots: number;
  availableSlots: number;
  congestionLevel: 'available' | 'normal' | 'busy' | 'full';
  isFavorite: boolean;
}

export interface ParkingSlot {
  slotId: string;
  slotNumber: string;
  isAvailable: boolean;
}

export interface FavoriteParkingLot {
  id: number;
  parkingLotId: number;
  name: string;
  location: string;
  totalSlots: number;
  availableSlots: number;
}

// 혼잡도 타입
export type CongestionLevel = 'available' | 'normal' | 'busy' | 'full';

export interface CongestionInfo {
  level: CongestionLevel;
  color: string;
  textColor: string;
  markerSize: number;
  label: string;
}

// 설정 관련 타입
export interface UserSettings {
  settingId: number;
  parkingSort: 'distance' | 'available';
  congestionAlert: boolean;
  availableAlert: boolean;
  autoLaunch: boolean;
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  language: 'ko' | 'en';
}

// 내 주차 위치 타입
export interface MyParkingLocation {
  parkingLotName: string;
  location: string;
  parkedAt: string;
}

// 필터 타입
export type FilterType = 'all' | 'favorites' | 'available' | 'normal' | 'busy' | 'full';

// 검색 관련 타입
export interface SearchHistory {
  id: string;
  query: string;
  parkingLotId?: number;
  timestamp: number;
}

// API 응답 타입
export interface ApiResponse<T> {
  data: T;
  error: {
    code: string;
    message: string;
  } | null;
}

export interface ApiError {
  code: string;
  message: string;
}

// 네비게이션 타입
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ParkingFloorPlan: {
    parkingLotId: number;
    parkingLotName: string;
  };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Favorites: undefined;
  MyPage: undefined;
};

// 지도 관련 타입
export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface MarkerData extends ParkingLot {
  congestionLevel: CongestionLevel;
}

// 상태 관리 타입
export interface AppState {
  selectedParkingLot: ParkingLot | null;
  searchQuery: string;
  selectedFilter: FilterType;
  bottomSheetIndex: number;
  isSearchFocused: boolean;
  searchHistory: SearchHistory[];
  
  // Actions
  setSelectedParkingLot: (parkingLot: ParkingLot | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedFilter: (filter: FilterType) => void;
  setBottomSheetIndex: (index: number) => void;
  setIsSearchFocused: (focused: boolean) => void;
  addToSearchHistory: (query: string, parkingLotId?: number) => void;
  clearSearchHistory: () => void;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
}