import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  SafeAreaView,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppStore } from '@/store/store';
import { useQuery } from '@tanstack/react-query';
import { parkingService } from '@/services/parking';
import { COLORS, FONT_SIZES, SPACING, SEARCH_CONFIG } from '@/utils/constants';
import { ParkingLot, SearchHistory } from '@/types';

interface SearchBarProps {
  onParkingLotSelect: (parkingLot: ParkingLot) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onParkingLotSelect }) => {
  const {
    searchQuery,
    isSearchFocused,
    searchHistory,
    selectedFilter,
    setSearchQuery,
    setIsSearchFocused,
    addToSearchHistory,
    clearSearchHistory,
  } = useAppStore();

  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const inputRef = useRef<TextInput>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // 검색 결과 쿼리
  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ['searchParkingLots', debouncedQuery],
    queryFn: () => parkingService.searchParkingLots(debouncedQuery),
    enabled: debouncedQuery.length >= SEARCH_CONFIG.MIN_SEARCH_LENGTH,
    staleTime: 30000,
  });

  // 디바운싱 처리
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(localQuery);
    }, SEARCH_CONFIG.DEBOUNCE_DELAY);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [localQuery]);

  const handleSearchPress = () => {
    setIsSearchFocused(true);
    setShowSuggestions(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleBackPress = () => {
    setIsSearchFocused(false);
    setShowSuggestions(false);
    setLocalQuery(searchQuery);
    Keyboard.dismiss();
  };

  const handleQueryChange = (text: string) => {
    setLocalQuery(text);
    setSearchQuery(text);
  };

  const handleParkingLotSelect = (parkingLot: ParkingLot) => {
    const query = parkingLot.name;
    setLocalQuery(query);
    setSearchQuery(query);
    addToSearchHistory(query, parkingLot.parkingLotId);
    setIsSearchFocused(false);
    setShowSuggestions(false);
    Keyboard.dismiss();
    onParkingLotSelect(parkingLot);
  };

  const handleHistorySelect = (historyItem: SearchHistory) => {
    setLocalQuery(historyItem.query);
    setSearchQuery(historyItem.query);
    if (historyItem.parkingLotId) {
      // 주차장 ID가 있으면 해당 주차장 선택
      // TODO: 주차장 ID로 주차장 정보 조회 후 선택
    }
    setIsSearchFocused(false);
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  const handleVoiceSearch = () => {
    // TODO: 음성 검색 기능 구현
    console.log('Voice search pressed');
  };

  const renderSearchResult = ({ item }: { item: ParkingLot }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleParkingLotSelect(item)}
    >
      <Icon name="location-outline" size={20} color={COLORS.text.secondary} />
      <View style={styles.suggestionContent}>
        <Text style={styles.suggestionTitle}>{item.name}</Text>
        <Text style={styles.suggestionSubtitle}>{item.location}</Text>
        <Text style={styles.suggestionAvailability}>
          잔여 {item.availableSlots}석 / 전체 {item.totalSlots}석
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderHistoryItem = ({ item }: { item: SearchHistory }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => handleHistorySelect(item)}
    >
      <Icon name="time-outline" size={20} color={COLORS.text.secondary} />
      <Text style={styles.historyText}>{item.query}</Text>
    </TouchableOpacity>
  );

  const renderFavoritesFilter = () => {
    const isActive = selectedFilter === 'favorites';
    return (
      <TouchableOpacity
        style={[styles.favoritesFilter, isActive && styles.favoritesFilterActive]}
        onPress={() => {
          // TODO: 즐겨찾기 필터 토글 구현
        }}
      >
        <Icon
          name={isActive ? "star" : "star-outline"}
          size={16}
          color={isActive ? COLORS.background : COLORS.text.secondary}
        />
        <Text style={[styles.favoritesFilterText, isActive && styles.favoritesFilterTextActive]}>
          즐겨찾기만 보기
        </Text>
      </TouchableOpacity>
    );
  };

  if (!isSearchFocused) {
    return (
      <TouchableOpacity style={styles.searchBar} onPress={handleSearchPress}>
        <Icon name="search-outline" size={20} color={COLORS.text.light} />
        <Text style={styles.placeholder}>
          {localQuery || '주차장을 검색하세요'}
        </Text>
        <TouchableOpacity onPress={handleVoiceSearch}>
          <Icon name="mic-outline" size={20} color={COLORS.text.light} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <Modal visible={showSuggestions} animationType="slide">
      <SafeAreaView style={styles.modal}>
        {/* 검색 헤더 */}
        <View style={styles.searchHeader}>
          <TouchableOpacity onPress={handleBackPress}>
            <Icon name="arrow-back" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
          
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            value={localQuery}
            onChangeText={handleQueryChange}
            placeholder="주차장을 검색하세요"
            placeholderTextColor={COLORS.text.light}
            autoFocus
          />
          
          <TouchableOpacity onPress={handleVoiceSearch}>
            <Icon name="mic-outline" size={24} color={COLORS.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* 즐겨찾기 필터 */}
        <View style={styles.filterContainer}>
          {renderFavoritesFilter()}
        </View>

        {/* 검색 결과 또는 최근 검색 */}
        <View style={styles.resultsContainer}>
          {localQuery.length >= SEARCH_CONFIG.MIN_SEARCH_LENGTH ? (
            // 검색 결과
            <>
              <Text style={styles.sectionTitle}>검색 결과</Text>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>검색 중...</Text>
                </View>
              ) : (
                <FlatList
                  data={searchResults}
                  renderItem={renderSearchResult}
                  keyExtractor={(item) => item.parkingLotId.toString()}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
                    </View>
                  }
                />
              )}
            </>
          ) : (
            // 최근 검색
            <>
              <View style={styles.historyHeader}>
                <Text style={styles.sectionTitle}>최근 검색</Text>
                {searchHistory.length > 0 && (
                  <TouchableOpacity onPress={clearSearchHistory}>
                    <Text style={styles.clearButton}>전체 삭제</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              {searchHistory.length > 0 ? (
                <FlatList
                  data={searchHistory}
                  renderItem={renderHistoryItem}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>최근 검색 기록이 없습니다.</Text>
                </View>
              )}
            </>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeholder: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.text.light,
  },
  modal: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
    paddingVertical: SPACING.sm,
  },
  filterContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  favoritesFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignSelf: 'flex-start',
  },
  favoritesFilterActive: {
    backgroundColor: COLORS.primary,
  },
  favoritesFilterText: {
    marginLeft: SPACING.xs,
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },
  favoritesFilterTextActive: {
    color: COLORS.background,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginVertical: SPACING.md,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  suggestionContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  suggestionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  suggestionSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  suggestionAvailability: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.success,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clearButton: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.danger,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  historyText: {
    marginLeft: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
  },
  loadingContainer: {
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
  },
  emptyContainer: {
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
  },
});

export default SearchBar;