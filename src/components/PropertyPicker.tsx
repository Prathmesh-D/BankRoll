import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SectionList,
  Platform,
  StatusBar,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../theme/tokens';
import type { Property, EditionConfig } from '../types/edition';
import type { Entity } from '../types/entity';
import { isMortgaged } from '../domain/propertyUtils';

interface Props {
  editionConfig: EditionConfig;
  mortgagedByEntity?: Entity;
  allEntities?: Entity[];
  selectedPropertyIds?: string[];
  hideHeader?: boolean;
  onSelect: (property: Property) => void;
  onClose: () => void;
}

export default function PropertyPicker({ editionConfig, mortgagedByEntity, allEntities, selectedPropertyIds = [], hideHeader, onSelect, onClose }: Props) {
  const [search, setSearch] = useState('');

  const sections = useMemo(() => {
    const lower = search.toLowerCase().trim();
    return editionConfig.colorGroups
      .map(group => {
        const properties = group.propertyIds
          .map(id => editionConfig.properties.find(p => p.id === id))
          .filter((p): p is Property => !!p)
          .filter(p => !lower || p.name.toLowerCase().includes(lower));
        return { title: group.label, color: group.hex, data: properties };
      })
      .filter(s => s.data.length > 0);
  }, [search, editionConfig]);

  const renderProperty = useCallback(({ item }: { item: Property }) => {
    const mortgagedByCurrent = mortgagedByEntity ? isMortgaged(item.id, mortgagedByEntity) : false;
    let mortgagedByOther: Entity | null = null;
    
    if (!mortgagedByCurrent && allEntities) {
      mortgagedByOther = allEntities.find(e => e.id !== mortgagedByEntity?.id && e.mortgagedProperties?.includes(item.id)) || null;
    }

    const isLockedByOther = !!mortgagedByOther;
    const isSelected = selectedPropertyIds.includes(item.id);
    const symbol = editionConfig.currency.symbol;

    return (
      <TouchableOpacity
        style={[
          styles.propertyRow, 
          mortgagedByCurrent && styles.propertyRowMortgaged,
          isSelected && styles.propertyRowSelected,
          isLockedByOther && styles.propertyRowLocked
        ]}
        onPress={() => onSelect(item)}
        activeOpacity={0.7}
        disabled={isLockedByOther}
      >
        <View style={[styles.colorSwatch, { backgroundColor: item.colorHex }, isLockedByOther && styles.colorSwatchLocked]} />
        <View style={styles.propertyInfo}>
          <View style={styles.propertyNameRow}>
            {mortgagedByCurrent && <Text style={styles.lockIcon}>🔒 </Text>}
            <Text style={[
              styles.propertyName, 
              mortgagedByCurrent && styles.propertyNameMortgaged,
              isLockedByOther && styles.propertyNameLocked
            ]}>
              {item.name}
            </Text>
          </View>
          {isLockedByOther ? (
            <Text style={styles.lockedByText}>🔒 Mortgaged by {mortgagedByOther.name}</Text>
          ) : (
            <>
              {!item.isStation && !item.isUtility && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Buy {symbol}{item.purchasePrice}</Text>
              <Text style={styles.priceDot}> · </Text>
              <Text style={styles.priceLabel}>Mtg {symbol}{item.mortgageValue}</Text>
              {item.houseCost > 0 && (
                <>
                  <Text style={styles.priceDot}> · </Text>
                  <Text style={styles.priceLabel}>🏠 {symbol}{item.houseCost}</Text>
                </>
              )}
            </View>
          )}
          {item.isStation && (
            <Text style={styles.priceLabel}>Station rent: {symbol}{item.stationRentTiers?.[0]}–{symbol}{item.stationRentTiers?.[3]}</Text>
          )}
          {item.isUtility && (
            <Text style={styles.priceLabel}>Utility — dice × multiplier</Text>
              )}
            </>
          )}
        </View>
        <View style={styles.rightActions}>
          {mortgagedByCurrent && (
            <Text style={styles.unmortgageLabel}>{symbol}{item.unmortgageCost} to lift</Text>
          )}
          {isSelected && (
            <View style={styles.checkCircle}>
              <Text style={styles.checkIcon}>✓</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }, [editionConfig.currency.symbol, mortgagedByEntity, allEntities, onSelect, selectedPropertyIds]);

  const renderSectionHeader = useCallback(({ section }: { section: { title: string; color: string } }) => (
    <View style={styles.sectionHeader}>
      <View style={[styles.groupSwatch, { backgroundColor: section.color }]} />
      <Text style={styles.sectionTitle}>{section.title.toUpperCase()}</Text>
    </View>
  ), []);

  return (
    <View style={styles.container}>
      {/* Header */}
      {!hideHeader && (
        <View style={styles.header}>
          <Text style={styles.title}>Properties</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Search */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search properties..."
          placeholderTextColor={Colors.ghost}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.clearSearch}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Property List */}
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={renderProperty}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.parchment,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.creamDark,
  },
  title: {
    fontSize: Typography.size.h1,
    fontFamily: Typography.display,
    color: Colors.maroon,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
    backgroundColor: Colors.creamDark,
  },
  closeText: {
    fontSize: 14,
    color: Colors.maroon,
    fontFamily: Typography.bodySemibold,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.cream,
    borderRadius: Radius.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.creamDark,
  },
  searchIcon: { fontSize: 14 },
  searchInput: {
    flex: 1,
    fontSize: Typography.size.body,
    fontFamily: Typography.body,
    color: Colors.ink,
  },
  clearSearch: {
    fontSize: 14,
    color: Colors.ghost,
  },
  listContent: {
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    backgroundColor: Colors.parchment,
    borderBottomWidth: 2,
    borderBottomColor: Colors.ink,
  },
  groupSwatch: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.ink,
  },
  sectionTitle: {
    fontSize: Typography.size.body,
    fontFamily: Typography.display,
    color: Colors.ink,
    letterSpacing: 2,
  },
  propertyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 16,
    backgroundColor: Colors.cream,
    gap: Spacing.md,
    minHeight: 72,
  },
  propertyRowMortgaged: {
    backgroundColor: Colors.creamDark,
    opacity: 0.7,
  },
  propertyRowSelected: {
    backgroundColor: '#E6F4EA', // Light green
    borderWidth: 2,
    borderColor: Colors.moneyGreen,
  },
  propertyRowLocked: {
    backgroundColor: Colors.creamDark,
    opacity: 0.5,
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.ink,
    flexShrink: 0,
  },
  propertyInfo: {
    flex: 1,
    gap: 4,
  },
  propertyNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 16,
  },
  propertyName: {
    fontSize: 20,
    fontFamily: Typography.display,
    color: Colors.ink,
    letterSpacing: 1,
  },
  propertyNameMortgaged: {
    textDecorationLine: 'line-through',
    color: 'rgba(0,0,0,0.5)',
  },
  propertyNameLocked: {
    color: 'rgba(0,0,0,0.4)',
  },
  lockedByText: {
    fontSize: 12,
    fontFamily: Typography.display,
    color: Colors.errorRed,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: Typography.size.caption,
    fontFamily: Typography.body,
    color: Colors.ghost,
  },
  priceDot: {
    fontSize: Typography.size.caption,
    color: Colors.ghost,
  },
  unmortgageLabel: {
    fontSize: Typography.size.caption,
    fontFamily: Typography.bodyMedium,
    color: Colors.gold,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.creamDark,
    marginLeft: Spacing.md + 12 + Spacing.sm,
  },
});
