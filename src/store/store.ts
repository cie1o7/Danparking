import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, SearchHistory, ParkingLot, FilterType } from '@/types';
import { STORAGE_KEYS, SEARCH_CONFIG } from '@/utils/constants';

interface AppStore extends AppState {
  // 추가 메서드들
  initializeSearchHistory: () => Promise<void>;
  persistSearchHistory: () => Promise<void>;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // 초기 상태
  selectedParkingLot: null,
  searchQuery: '',
  selectedFilter: 'all',
  bottomSheetIndex: 0,
  isSearchFocused: false,
  searchHistory: [],

  // Actions
  setSelectedParkingLot: (parkingLot: ParkingLot | null) => {
    set({ selectedParkingLot: parkingLot });
    
    // 주차장이 선택되면 바텀시트를 50%로 확장
    if (parkingLot) {
      set({ bottomSheetIndex: 1 });
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setSelectedFilter: (filter: FilterType) => {
    set({ selectedFilter: filter });
  },

  setBottomSheetIndex: (index: number) => {
    set({ bottomSheetIndex: index });
  },

  setIsSearchFocused: (focused: boolean) => {
    set({ isSearchFocused: focused });
  },

  addToSearchHistory: (query: string, parkingLotId?: number) => {
    const { searchHistory } = get();
    
    // 빈 검색어는 저장하지 않음
    if (!query.trim()) return;
    
    // 중복 제거 (같은 검색어가 있으면 제거)
    const filteredHistory = searchHistory.filter(item => item.query !== query);
    
    // 새로운 검색 기록 추가
    const newHistoryItem: SearchHistory = {
      id: Date.now().toString(),
      query: query.trim(),
      parkingLotId,
      timestamp: Date.now(),
    };
    
    // 최대 개수 제한
    const updatedHistory = [newHistoryItem, ...filteredHistory].slice(0, SEARCH_CONFIG.MAX_HISTORY_ITEMS);
    
    set({ searchHistory: updatedHistory });
    
    // 로컬 스토리지에 저장
    get().persistSearchHistory();
  },

  clearSearchHistory: () => {
    set({ searchHistory: [] });
    AsyncStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
  },

  // 검색 기록 초기화
  initializeSearchHistory: async () => {
    try {
      const storedHistory = await AsyncStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
      if (storedHistory) {
        const parsedHistory: SearchHistory[] = JSON.parse(storedHistory);
        set({ searchHistory: parsedHistory });
      }
    } catch (error) {
      console.error('Failed to load search history:', error);
    }
  },

  // 검색 기록 저장
  persistSearchHistory: async () => {
    try {
      const { searchHistory } = get();
      await AsyncStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(searchHistory));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  },
}));

// 필터 상태 초기화 헬퍼 함수
export const resetFilters = () => {
  useAppStore.getState().setSelectedFilter('all');
  useAppStore.getState().setSearchQuery('');
};

// 검색 상태 초기화 헬퍼 함수
export const resetSearchState = () => {
  useAppStore.getState().setSearchQuery('');
  useAppStore.getState().setIsSearchFocused(false);
};

// 주차장 선택 및 지도 이동 헬퍼 함수
export const selectParkingLotAndFocus = (parkingLot: ParkingLot) => {
  useAppStore.getState().setSelectedParkingLot(parkingLot);
  useAppStore.getState().setBottomSheetIndex(1); // 50%로 확장
  useAppStore.getState().setIsSearchFocused(false);
};