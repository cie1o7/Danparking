import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppStore } from '@/store/store';
import { COLORS, FONT_SIZES, SPACING, CONGESTION_CONFIG } from '@/utils/constants';
import { FilterType, CongestionLevel } from '@/types';

interface FilterOption {
  id: FilterType;
  label: string;
  icon?: string;
  color?: string;
}

const FilterButtons: React.FC = () => {
  const { selectedFilter, setSelectedFilter } = useAppStore();

  const filterOptions: FilterOption[] = [
    {
      id: 'all',
      label: '전체',
      color: COLORS.text.primary,
    },
    {
      id: 'favorites',
      label: '즐겨찾기',
      icon: 'star',
      color: COLORS.text.secondary,
    },
    {
      id: 'available',
      label: '여유',
      color: CONGESTION_CONFIG.available.color,
    },
    {
      id: 'normal',
      label: '보통',
      color: CONGESTION_CONFIG.normal.color,
    },
    {
      id: 'busy',
      label: '혼잡',
      color: CONGESTION_CONFIG.busy.color,
    },
    {
      id: 'full',
      label: '만차',
      color: CONGESTION_CONFIG.full.color,
    },
  ];

  const handleFilterPress = (filterId: FilterType) => {
    setSelectedFilter(filterId);
  };

  const renderFilterButton = (option: FilterOption) => {
    const isSelected = selectedFilter === option.id;
    const isAll = option.id === 'all';
    const isFavorites = option.id === 'favorites';
    
    const buttonStyleArray: ViewStyle[] = [styles.filterButton];
    const textStyleArray: TextStyle[] = [styles.filterButtonText];
    let iconColor = COLORS.background;

    if (isSelected) {
      if (isAll) {
        buttonStyleArray.push({
          ...styles.filterButton,
          ...styles.filterButtonSelectedAll,
        });
        textStyleArray.push({
          ...styles.filterButtonText,
          ...styles.filterButtonTextSelectedAll,
        });
      } else if (isFavorites) {
        buttonStyleArray.push({
          ...styles.filterButton,
          ...styles.filterButtonSelectedFavorites,
        });
        textStyleArray.push({
          ...styles.filterButtonText,
          ...styles.filterButtonTextSelectedFavorites,
        });
        iconColor = COLORS.background;
      } else {
        buttonStyleArray.push({
          ...styles.filterButton,
          ...styles.filterButtonSelected,
          backgroundColor: option.color || COLORS.surface,
        });
        textStyleArray.push({
          ...styles.filterButtonText,
          ...styles.filterButtonTextSelected,
        });
      }
    } else {
      if (isFavorites) {
        textStyleArray.push({
          ...styles.filterButtonText,
          color: COLORS.text.secondary,
        });
        iconColor = COLORS.text.secondary;
      } else if (!isAll && option.color) {
        textStyleArray.push({
          ...styles.filterButtonText,
          color: option.color,
        });
      }
    }

    return (
      <TouchableOpacity
        key={option.id}
        style={buttonStyleArray}
        onPress={() => handleFilterPress(option.id)}
        activeOpacity={0.7}
      >
        {option.icon && (
          <Icon
            name={isSelected && isFavorites ? 'star' : 'star-outline'}
            size={16}
            color={iconColor}
            style={styles.filterButtonIcon}
          />
        )}
        <Text style={textStyleArray}>{option.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filterOptions.map(renderFilterButton)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.sm,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 36,
  } as ViewStyle,
  filterButtonSelected: {
    borderColor: 'transparent',
  } as ViewStyle,
  filterButtonSelectedAll: {
    backgroundColor: COLORS.text.primary,
    borderColor: COLORS.text.primary,
  } as ViewStyle,
  filterButtonSelectedFavorites: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  } as ViewStyle,
  filterButtonIcon: {
    marginRight: SPACING.xs,
  } as ViewStyle,
  filterButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.text.secondary,
  } as TextStyle,
  filterButtonTextSelected: {
    color: COLORS.background,
    fontWeight: '600',
    fontSize: FONT_SIZES.sm,
  } as TextStyle,
  filterButtonTextSelectedAll: {
    color: COLORS.background,
    fontWeight: '600',
    fontSize: FONT_SIZES.sm,
  } as TextStyle,
  filterButtonTextSelectedFavorites: {
    color: COLORS.background,
    fontWeight: '600',
    fontSize: FONT_SIZES.sm,
  } as TextStyle,
});

export default FilterButtons;
