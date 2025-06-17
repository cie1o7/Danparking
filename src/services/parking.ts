import apiClient from './api';
import { 
  ParkingLot, 
  ParkingSlot, 
  FavoriteParkingLot,
  UserSettings,
  MyParkingLocation
} from '@/types';

export class ParkingService {
  /**
   * 모든 주차장 정보 조회
   */
  async getAllParkingLots(): Promise<ParkingLot[]> {
    const response = await apiClient.get<ParkingLot[]>('/parking-lots');
    
    if (response.error) {
      throw response.error;
    }
    
    return response.data;
  }

  /**
   * 특정 주차장의 주차자리 정보 조회
   */
  async getParkingSlotsByParkingLotId(parkingLotId: number): Promise<ParkingSlot[]> {
    // TODO: API 구현
    // 테스트용 데이터 생성
    const mockSlots: ParkingSlot[] = Array.from({ length: 50 }, (_, index) => ({
      slotId: `${parkingLotId}-${index + 1}`,
      slotNumber: `${index + 1}`,
      isAvailable: Math.random() > 0.5, // 랜덤하게 주차 가능 여부 설정
    }));
    
    return Promise.resolve(mockSlots);
  }

  /**
   * 모든 주차자리 정보 조회
   */
  async getAllParkingSlots(): Promise<ParkingSlot[]> {
    const response = await apiClient.get<ParkingSlot[]>('/parking-slots/all');
    
    if (response.error) {
      throw response.error;
    }
    
    return response.data;
  }

  /**
   * 즐겨찾기 주차장 목록 조회
   */
  async getFavoriteParkingLots(): Promise<FavoriteParkingLot[]> {
    const response = await apiClient.get<FavoriteParkingLot[]>('/favorite-parking-lots');
    
    if (response.error) {
      throw response.error;
    }
    
    return response.data;
  }

  /**
   * 즐겨찾기 주차장 추가
   */
  async addFavoriteParkingLot(parkingLotId: number): Promise<FavoriteParkingLot> {
    const response = await apiClient.post<FavoriteParkingLot>('/favorite-parking-lots', {
      parkingLotId,
    });
    
    if (response.error) {
      throw response.error;
    }
    
    return response.data;
  }

  /**
   * 즐겨찾기 주차장 제거
   */
  async removeFavoriteParkingLot(favoriteParkingLotId: number): Promise<string> {
    const response = await apiClient.delete<string>(`/favorite-parking-lots/${favoriteParkingLotId}`);
    
    if (response.error) {
      throw response.error;
    }
    
    return response.data;
  }

  /**
   * 사용자 설정 조회
   */
  async getMySettings(): Promise<UserSettings> {
    const response = await apiClient.get<UserSettings>('/settings');
    
    if (response.error) {
      throw response.error;
    }
    
    return response.data;
  }

  /**
   * 사용자 설정 업데이트
   */
  async updateMySettings(settingsId: number, settings: Partial<UserSettings>): Promise<UserSettings> {
    const response = await apiClient.put<UserSettings>(`/settings/${settingsId}`, settings);
    
    if (response.error) {
      throw response.error;
    }
    
    return response.data;
  }

  /**
   * 내 주차 위치 저장 (API에 없어서 추가 구현)
   */
  async saveMyParkingLocation(parkingLocation: Omit<MyParkingLocation, 'parkedAt'>): Promise<MyParkingLocation> {
    const response = await apiClient.post<MyParkingLocation>('/me/parking', {
      ...parkingLocation,
      parkedAt: new Date().toISOString(),
    });
    
    if (response.error) {
      throw response.error;
    }
    
    return response.data;
  }

  /**
   * 내 주차 위치 조회 (API에 없어서 추가 구현)
   */
  async getMyParkingLocation(): Promise<MyParkingLocation> {
    // TODO: API 구현
    return {
      parkingLotName: '테스트 주차장',
      location: '1층 A구역',
      parkedAt: new Date().toISOString(),
    };
  }

  /**
   * 내 주차 위치 삭제 (API에 없어서 추가 구현)
   */
  async clearMyParkingLocation(): Promise<void> {
    // TODO: API 구현
    return Promise.resolve();
  }

  /**
   * 주차장 검색 (API에 없어서 추가 구현)
   */
  async searchParkingLots(query: string): Promise<ParkingLot[]> {
    const response = await apiClient.get<ParkingLot[]>('/parking-lots/search', {
      params: { q: query },
    });
    
    if (response.error) {
      throw response.error;
    }
    
    return response.data;
  }
}

export const parkingService = new ParkingService();