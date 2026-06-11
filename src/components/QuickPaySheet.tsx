import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { Colors, Typography, Spacing, Shadows, Radius } from '../theme/tokens';
import type { Entity } from '../types/entity';
import type { EditionConfig } from '../types/edition';
import PropertyPicker from './PropertyPicker';
import type { Property } from '../types/edition';

interface Props {
  visible: boolean;
  fromEntity: Entity;
  toEntity: Entity;
  editionConfig: EditionConfig;
  prefilledAmount?: number;
  onPay: (amount: number, label?: string, propertyId?: string) => void;
  onClose: () => void;
}

const DENOMINATIONS = [10, 20, 50, 100, 500];

export default function QuickPaySheet({
  visible,
  fromEntity,
  toEntity,
  editionConfig,
  prefilledAmount,
  onPay,
  onClose,
}: Props) {
  const [amountInput, setAmountInput] = useState('');
  const [showPropertyPicker, setShowPropertyPicker] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedRentAmount, setSelectedRentAmount] = useState<number | null>(null);
  const [selectedRentLabel, setSelectedRentLabel] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'amount' | 'rent'>('amount');

  useEffect(() => {
    if (visible && prefilledAmount) {
      setAmountInput(prefilledAmount.toString());
      setActiveTab('amount');
      setSelectedProperty(null);
    }
  }, [visible, prefilledAmount]);

  const total = activeTab === 'rent' && selectedProperty && selectedRentAmount !== null
    ? selectedRentAmount
    : parseInt(amountInput) || 0;

  const symbol = editionConfig.currency.symbol;

  const formatBal = (amount: number) => {
    const sign = amount < 0 ? '-' : '';
    return `${sign}${symbol}${Math.abs(amount)}`;
  };

  const handlePropertySelect = useCallback((property: Property) => {
    setSelectedProperty(property);
    setShowPropertyPicker(false);
    setActiveTab('rent');
    if (property.isStation) {
      setSelectedRentAmount(property.stationRentTiers?.[0] || 25);
      setSelectedRentLabel('1 Station');
    } else if (property.isUtility) {
      setSelectedRentAmount(null);
      setSelectedRentLabel(null);
    } else {
      setSelectedRentAmount(property.rentTiers[0].amount);
      setSelectedRentLabel('Base Rent');
    }
  }, []);

  const handlePay = useCallback(() => {
    if (total <= 0) return;
    const label = activeTab === 'rent' && selectedProperty
      ? `Rent · ${selectedProperty.name} (${selectedRentLabel || 'Base'})`
      : undefined;
    const propertyId = activeTab === 'rent' ? selectedProperty?.id : undefined;
    onPay(total, label, propertyId);
    setAmountInput('');
    setSelectedProperty(null);
  }, [total, selectedProperty, activeTab, selectedRentLabel, onPay]);

  const renderRentTiers = (prop: Property) => {
    if (prop.isUtility) {
      return (
        <View style={styles.utilityNotice}>
          <Text style={styles.utilityText}>
            For Utilities, multiply dice roll by 4x or 10x, and use TRANSFER tab.
          </Text>
        </View>
      );
    }

    if (prop.isStation) {
      const tiers = prop.stationRentTiers || [25, 50, 100, 200];
      return tiers.map((rent, i) => (
        <TouchableOpacity
          key={i}
          style={[styles.tierRow, selectedRentAmount === rent && styles.tierRowSelected]}
          onPress={() => { setSelectedRentAmount(rent); setSelectedRentLabel(`${i+1} Station(s)`); }}
        >
          <Text style={[styles.tierLabel, selectedRentAmount === rent && styles.tierLabelSelected]}>
            {i+1} Station{i > 0 ? 's' : ''}
          </Text>
          <Text style={[styles.tierAmount, selectedRentAmount === rent && styles.tierAmountSelected]}>
            {symbol}{rent}
          </Text>
        </TouchableOpacity>
      ));
    }

    const labels = ['Base Rent', '1 House', '2 Houses', '3 Houses', '4 Houses', 'Hotel'];
    return prop.rentTiers.map((tier, i) => (
      <TouchableOpacity
        key={i}
        style={[
          styles.tierRow, 
          selectedRentAmount === tier.amount && styles.tierRowSelected,
          i === 5 && styles.tierRowHotel, // Hotel accent
        ]}
        onPress={() => { setSelectedRentAmount(tier.amount); setSelectedRentLabel(labels[i]); }}
      >
        <Text style={[
          styles.tierLabel, 
          selectedRentAmount === tier.amount && styles.tierLabelSelected,
          i === 5 && styles.tierLabelHotel
        ]}>
          {labels[i]}
        </Text>
        <Text style={[
          styles.tierAmount, 
          selectedRentAmount === tier.amount && styles.tierAmountSelected,
          i === 5 && styles.tierAmountHotel
        ]}>
          {symbol}{tier.amount}
        </Text>
      </TouchableOpacity>
    ));
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      {!showPropertyPicker && (
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1}>
        <TouchableOpacity activeOpacity={1} style={styles.sheet}>
          <View style={styles.handle} />

          {/* Header Entities */}
          <View style={styles.header}>
            <View style={styles.entityRow}>
              <View style={styles.entityCol}>
                <Text style={styles.headerEntityName} numberOfLines={1}>{fromEntity.name}</Text>
                {fromEntity.type !== 'bank' && (
                  <TouchableOpacity onPress={() => {
                    setAmountInput(Math.max(0, fromEntity.balance).toString());
                    setActiveTab('amount');
                  }}>
                    <Text style={styles.headerEntityBalance}>{formatBal(fromEntity.balance)}</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.headerArrow}>→</Text>
              <View style={styles.entityCol}>
                <Text style={styles.headerEntityName} numberOfLines={1}>{toEntity.name}</Text>
                {toEntity.type !== 'bank' && (
                  <TouchableOpacity onPress={() => {
                    setAmountInput(Math.max(0, toEntity.balance).toString());
                    setActiveTab('amount');
                  }}>
                    <Text style={styles.headerEntityBalance}>{formatBal(toEntity.balance)}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>X</Text>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity 
              style={[styles.tabBtn, activeTab === 'amount' && styles.activeTabBtn]} 
              onPress={() => setActiveTab('amount')}
            >
              <Text style={[styles.tabText, activeTab === 'amount' && styles.activeTabText]}>TRANSFER</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabBtn, activeTab === 'rent' && styles.activeTabBtn]} 
              onPress={() => setActiveTab('rent')}
            >
              <Text style={[styles.tabText, activeTab === 'rent' && styles.activeTabText]}>RENT CALC</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
            {activeTab === 'amount' ? (
              <View style={styles.transferPanel}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputSymbol}>{symbol}</Text>
                  <Text style={styles.inputText}>{amountInput || '0'}</Text>
                </View>

                {/* Chips */}
                <View style={styles.chipsRow}>
                  {DENOMINATIONS.map(d => (
                    <TouchableOpacity
                      key={d}
                      style={styles.chipBtn}
                      onPress={() => setAmountInput(prev => (parseInt(prev || '0') + d).toString())}
                    >
                      <Text style={styles.chipText}>+{d}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Numpad */}
                <View style={styles.numpad}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <TouchableOpacity
                      key={num}
                      style={styles.keyBtn}
                      onPress={() => setAmountInput(prev => prev + num)}
                    >
                      <Text style={styles.keyText}>{num}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={[styles.keyBtn, styles.keyBtnDel]}
                    onPress={() => setAmountInput(prev => prev.slice(0, -1))}
                  >
                    <Text style={[styles.keyText, { color: Colors.errorRed }]}>DEL</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.keyBtn}
                    onPress={() => setAmountInput(prev => prev + '0')}
                  >
                    <Text style={styles.keyText}>0</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keyBtn, styles.keyBtn00]}
                    onPress={() => setAmountInput(prev => prev ? prev + '00' : '0')}
                  >
                    <Text style={styles.keyText}>00</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.rentPanel}>
                <Text style={styles.rentLabel}>SELECT PROPERTY</Text>
                <TouchableOpacity
                  style={styles.propertySelectBtn}
                  onPress={() => setShowPropertyPicker(true)}
                >
                  {selectedProperty ? (
                    <View style={styles.propRow}>
                      <View style={[styles.propColor, { backgroundColor: selectedProperty.colorGroup }]} />
                      <Text style={styles.propName}>{selectedProperty.name}</Text>
                    </View>
                  ) : (
                    <Text style={styles.propPlaceholder}>Tap to select...</Text>
                  )}
                  <Text style={styles.propArrow}>▼</Text>
                </TouchableOpacity>

                {selectedProperty && (
                  <View style={styles.modifiersSection}>
                    <Text style={styles.rentLabel}>STATUS / MODIFIERS</Text>
                    <View style={styles.tiersGrid}>
                      {renderRentTiers(selectedProperty)}
                    </View>

                    <View style={styles.calcResult}>
                      <Text style={styles.calcResultLabel}>CALCULATED RENT</Text>
                      <Text style={styles.calcResultValue}>
                        {selectedRentAmount !== null ? `${symbol}${selectedRentAmount}` : '--'}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footerActions}>
            <View style={styles.footerSummary}>
              <View style={styles.footerEntities}>
                <Text style={styles.footerTotalLabel}>TOTAL AMOUNT</Text>
              </View>
              <Text style={styles.footerTotal}>{symbol}{total.toLocaleString()}</Text>
            </View>

            <TouchableOpacity
              style={[styles.payBtn, total <= 0 && styles.payBtnDisabled]}
              onPress={handlePay}
              disabled={total <= 0}
            >
              <Text style={styles.payBtnText}>CONFIRM PAYMENT</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
      )}

      {showPropertyPicker && (
        <PropertyPicker
          onClose={() => setShowPropertyPicker(false)}
          onSelect={handlePropertySelect}
          editionConfig={editionConfig}
        />
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.cream,
    borderTopWidth: 4,
    borderColor: Colors.ink,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '95%',
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 20,
  },
  handle: {
    width: 48,
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  header: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  entityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  entityCol: {
    alignItems: 'center',
    maxWidth: 120,
  },
  headerEntityName: {
    fontSize: Typography.size.h2,
    fontFamily: Typography.display,
    color: Colors.ink,
  },
  headerEntityBalance: {
    fontSize: 14,
    fontFamily: Typography.bodySemibold,
    color: 'rgba(0,0,0,0.5)',
    marginTop: 4,
  },
  headerArrow: {
    fontSize: 24,
    color: 'rgba(0,0,0,0.4)',
    fontFamily: Typography.display,
  },
  closeBtn: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    color: 'rgba(0,0,0,0.5)',
    fontFamily: Typography.bodySemibold,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 32,
  },
  tabBtn: {
    paddingBottom: 4,
    borderBottomWidth: 4,
    borderColor: 'transparent',
    opacity: 0.4,
  },
  activeTabBtn: {
    borderColor: Colors.ink,
    opacity: 1,
  },
  tabText: {
    fontSize: 24,
    fontFamily: Typography.display,
    color: Colors.ink,
  },
  activeTabText: {
    color: Colors.ink,
  },
  content: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  transferPanel: {
    gap: 24,
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.ink,
    padding: 16,
    ...Shadows.card,
  },
  inputSymbol: {
    position: 'absolute',
    left: 16,
    top: 20,
    fontSize: 24,
    fontFamily: Typography.display,
    color: 'rgba(0,0,0,0.3)',
  },
  inputText: {
    fontSize: 48,
    fontFamily: Typography.display,
    color: Colors.ink,
    textAlign: 'right',
    letterSpacing: 2,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipBtn: {
    flex: 1,
    minWidth: 60,
    height: 40,
    backgroundColor: '#FEFCE8',
    borderWidth: 2,
    borderColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.btn,
  },
  chipText: {
    fontSize: 16,
    fontFamily: Typography.display,
    color: Colors.ink,
  },
  numpad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  keyBtn: {
    width: '31%',
    height: 54,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.btn,
  },
  keyBtnDel: {
    backgroundColor: '#FFF0F2',
    borderColor: Colors.errorRed,
  },
  keyBtn00: {
    backgroundColor: '#F0FDF4',
    borderColor: Colors.green,
  },
  keyText: {
    fontSize: 24,
    fontFamily: Typography.display,
    color: Colors.ink,
  },
  rentPanel: {
    gap: 20,
  },
  rentLabel: {
    fontSize: 10,
    fontFamily: Typography.display,
    color: 'rgba(0,0,0,0.5)',
    letterSpacing: 2,
    marginLeft: 4,
    marginBottom: -16,
  },
  propertySelectBtn: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.ink,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.btn,
  },
  propRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  propColor: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: Colors.ink,
    borderRadius: 4,
  },
  propName: {
    fontSize: 16,
    fontFamily: Typography.bodySemibold,
    fontStyle: 'italic',
    color: Colors.ink,
  },
  propPlaceholder: {
    fontSize: 16,
    fontFamily: Typography.bodySemibold,
    fontStyle: 'italic',
    color: 'rgba(0,0,0,0.4)',
  },
  propArrow: {
    fontSize: 12,
    color: Colors.ink,
  },
  modifiersSection: {
    gap: 16,
  },
  tiersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tierRow: {
    width: '48%',
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.ink,
    padding: 12,
    alignItems: 'center',
    ...Shadows.btn,
  },
  tierRowSelected: {
    backgroundColor: Colors.ink,
  },
  tierLabel: {
    fontSize: 12,
    fontFamily: Typography.bodySemibold,
    color: Colors.ink,
  },
  tierLabelSelected: {
    color: Colors.white,
  },
  tierAmount: {
    fontSize: 18,
    fontFamily: Typography.display,
    color: Colors.ink,
    marginTop: 4,
  },
  tierAmountSelected: {
    color: Colors.white,
  },
  tierRowHotel: {
    backgroundColor: Colors.errorRed,
  },
  tierLabelHotel: {
    color: Colors.white,
  },
  tierAmountHotel: {
    color: Colors.white,
  },
  utilityNotice: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderWidth: 2,
    borderColor: Colors.ink,
  },
  utilityText: {
    fontSize: 14,
    fontFamily: Typography.bodyMedium,
    color: Colors.ink,
    textAlign: 'center',
  },
  calcResult: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.ink,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.card,
  },
  calcResultLabel: {
    fontSize: 12,
    fontFamily: Typography.display,
    color: 'rgba(0,0,0,0.4)',
    letterSpacing: 1,
  },
  calcResultValue: {
    fontSize: 36,
    fontFamily: Typography.display,
    color: Colors.ink,
  },
  footerActions: {
    backgroundColor: Colors.white,
    borderTopWidth: 2,
    borderTopColor: Colors.ink,
    padding: 24,
    paddingBottom: 34,
    gap: 16,
  },
  footerSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerEntities: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerTotalLabel: {
    fontSize: 16,
    fontFamily: Typography.bodySemibold,
    color: Colors.ghost,
    letterSpacing: 2,
  },
  footerTotal: {
    fontSize: 24,
    fontFamily: Typography.display,
    color: Colors.ink,
  },
  payBtn: {
    backgroundColor: Colors.gold,
    borderWidth: 2,
    borderColor: Colors.ink,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.btn,
  },
  payBtnDisabled: {
    opacity: 0.5,
  },
  payBtnText: {
    fontSize: 20,
    fontFamily: Typography.display,
    color: Colors.white,
    letterSpacing: 2,
  },
});
