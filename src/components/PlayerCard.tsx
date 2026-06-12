import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  SharedValue,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { Colors, Typography, Spacing, Radius, Shadows } from '../theme/tokens';
import { Springs } from '../theme/animations';
import { AVATAR_IMAGES } from '../domain/defaults';
import type { Entity } from '../types/entity';
import type { CurrencyConfig } from '../types/edition';
import { useGameStore } from '../store/useGameStore';

interface Props {
  entity: Entity;
  currency: CurrencyConfig;
  onSalaryPress: (entity: Entity) => void;
  onMortgagePress: (entity: Entity) => void;
  onDragStart?: (entity: Entity) => void;
  onDragUpdate?: (entity: Entity, x: number, y: number) => void;
  onDragEnd?: (entity: Entity) => void;
  onDoubleTapBalance?: (entity: Entity) => void;
  cursorX?: SharedValue<number>;
  cursorY?: SharedValue<number>;
  isDragging?: SharedValue<boolean>;
}

// Simple format to match the HTML design ₩25000
const formatRetroBalance = (amount: number, currency: CurrencyConfig) => {
  const sign = amount < 0 ? '-' : '';
  const abs = Math.abs(amount).toString();
  return `${sign}${currency.symbol}${abs}`;
};

export default React.memo(function PlayerCard({
  entity,
  currency,
  onSalaryPress,
  onMortgagePress,
  onDragStart,
  onDragUpdate,
  onDragEnd,
  onDoubleTapBalance,
  cursorX,
  cursorY,
  isDragging,
}: Props) {
  const scale = useSharedValue(1);
  const [btnPressed, setBtnPressed] = useState(false);

  const panGesture = Gesture.Pan()
    .enabled(entity.isActive)
    .onBegin((event) => {
      scale.value = withSpring(1.03, Springs.snappy);
    })
    .onStart((event) => {
      if (isDragging && cursorX && cursorY) {
        isDragging.value = true;
        cursorX.value = event.absoluteX;
        cursorY.value = event.absoluteY;
      }
      if (onDragStart) runOnJS(onDragStart)(entity);
    })
    .onUpdate((event) => {
      if (cursorX && cursorY) {
        cursorX.value = event.absoluteX;
        cursorY.value = event.absoluteY;
      }
      if (onDragUpdate) runOnJS(onDragUpdate)(entity, event.absoluteX, event.absoluteY);
    })
    .onEnd((event) => {
      scale.value = withSpring(1.0, Springs.gentle);
      if (isDragging && cursorX && cursorY) {
        isDragging.value = false;
        cursorX.value = -1000;
        cursorY.value = -1000;
      }
      if (onDragEnd) runOnJS(onDragEnd)(entity);
    })
    .onFinalize(() => {
      scale.value = withSpring(1.0, Springs.gentle);
      if (isDragging) {
        isDragging.value = false;
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const balanceFormatted = formatRetroBalance(entity.balance, currency);
  const isNegative = entity.balance < 0;
  const isBankrupt = !entity.isActive;
  const isBank = entity.type === 'bank';
  const infiniteBankMoney = useGameStore(s => s.session?.houseRules.infiniteBankMoney ?? false);
  const displayBalance = (isBank && infiniteBankMoney) ? '∞' : balanceFormatted;

  const handleSalary = useCallback(() => {
    onSalaryPress(entity);
  }, [entity, onSalaryPress]);

  const handleMortgage = useCallback(() => {
    onMortgagePress(entity);
  }, [entity, onMortgagePress]);

  const [moreBtnPressed, setMoreBtnPressed] = useState(false);

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.cardContainer, animatedStyle]}>
        <View
          style={[
            styles.cardWrapper,
            isBankrupt && styles.cardBankrupt,
            // If active/targeted, we can show red outline or just rely on dropHalo
          ]}
        >
          {/* Top Color Bar */}
          <View style={[styles.colorBar, { backgroundColor: entity.color }]}>
            <View style={styles.colorBarPill} />
          </View>

          {/* Card Body */}
          <View style={styles.cardBody}>
            
            {/* Top Left Mortgage Action */}
            {!isBankrupt && !isBank && (
              <View style={styles.actionsContainerLeft}>
                <Pressable
                  onPressIn={() => setMoreBtnPressed(true)}
                  onPressOut={() => setMoreBtnPressed(false)}
                  onPress={handleMortgage}
                  style={[styles.salaryBtn, moreBtnPressed && styles.salaryBtnPressed]}
                >
                  <Text style={[styles.salaryBtnText, { color: Colors.ink }]}>🏦</Text>
                  {entity.mortgagedProperties?.length > 0 && (
                    <View style={styles.mortgageDot}>
                      <Text style={styles.mortgageDotText}>{entity.mortgagedProperties.length}</Text>
                    </View>
                  )}
                </Pressable>
              </View>
            )}

            {/* Top Right Actions */}
            {!isBankrupt && !isBank && (
              <View style={styles.actionsContainerRight}>
                <Pressable
                  onPressIn={() => setBtnPressed(true)}
                  onPressOut={() => setBtnPressed(false)}
                  onPress={handleSalary}
                  style={[styles.salaryBtn, btnPressed && styles.salaryBtnPressed]}
                >
                  <Text style={styles.salaryBtnText}>$</Text>
                </Pressable>
              </View>
            )}

            {/* Avatar */}
            {AVATAR_IMAGES[entity.avatar] ? (
              <Image source={AVATAR_IMAGES[entity.avatar]} style={styles.avatarImage} resizeMode="contain" />
            ) : (
              <Text style={styles.avatar}>{entity.avatar}</Text>
            )}

            {/* Name */}
            <Text style={styles.name} numberOfLines={1}>{entity.name}</Text>

            <View style={styles.divider} />

            {/* Balance */}
            <TouchableOpacity onPress={() => onDoubleTapBalance?.(entity)} activeOpacity={0.9} style={styles.balanceContainer}>
              <Text
                style={[
                  styles.balance,
                  isNegative && styles.balanceNegative,
                  (isBank && infiniteBankMoney) && { fontSize: 80, lineHeight: 80, paddingBottom: 16 }
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {displayBalance}
              </Text>
            </TouchableOpacity>



          </View>
        </View>

        {/* Bankrupt Stamp Overlay */}
        {isBankrupt && (
          <View style={styles.bankruptOverlay}>
            <View style={styles.bankruptStamp}>
              <Text style={styles.bankruptStampText} numberOfLines={1} adjustsFontSizeToFit>BANKRUPT</Text>
            </View>
          </View>
        )}
      </Animated.View>
    </GestureDetector>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.entity.balance === nextProps.entity.balance &&
    prevProps.entity.isActive === nextProps.entity.isActive &&
    prevProps.entity.mortgagedProperties?.length === nextProps.entity.mortgagedProperties?.length &&
    prevProps.currency === nextProps.currency
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    height: 200,
    width: '100%',
    position: 'relative',
  },
  cardWrapper: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.ink,
    // Neobrutalist Shadow
    shadowColor: Colors.ink,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  cardBankrupt: {
    opacity: 0.6,
  },
  colorBar: {
    height: 24,
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorBarPill: {
    width: '50%',
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 99,
  },
  cardBody: {
    flex: 1,
    padding: Spacing.sm,
    alignItems: 'center',
    paddingTop: 16,
    position: 'relative',
  },
  actionsContainerRight: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    flexDirection: 'row',
    gap: 8,
  },
  actionsContainerLeft: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10,
    flexDirection: 'row',
    gap: 8,
  },
  salaryBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.ink,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  salaryBtnPressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    shadowOpacity: 0,
    elevation: 0,
  },
  salaryBtnText: {
    fontSize: 20,
    color: Colors.green,
    fontFamily: Typography.display,
  },
  avatar: {
    fontSize: 48,
    marginBottom: 8,
  },
  avatarImage: {
    width: 56,
    height: 56,
    marginBottom: 8,
    alignSelf: 'center',
  },
  name: {
    fontSize: 19,
    fontFamily: Typography.display,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: Colors.ink,
    backgroundColor: Colors.gold,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: Colors.ink,
    marginBottom: 8,
    textAlign: 'center',
    alignSelf: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.ink,
    width: '60%',
    alignSelf: 'center',
    opacity: 0.2, // Subtle line
  },
  balanceContainer: {
    marginTop: 'auto',
    width: '100%',
  },
  balance: {
    fontSize: 28,
    fontFamily: Typography.display, // Bebas
    color: Colors.ink,
    letterSpacing: 1,
    textAlign: 'center',
  },
  balanceNegative: {
    color: Colors.errorRed,
  },
  mortgageDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.errorRed,
    borderRadius: Radius.full,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.ink,
  },
  mortgageDotText: {
    color: Colors.white,
    fontSize: 10,
    fontFamily: Typography.display,
  },
  bankruptOverlay: {
    ...StyleSheet.absoluteFill as object,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  bankruptStamp: {
    borderWidth: 4,
    borderColor: Colors.errorRed,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.8)',
    transform: [{ rotate: '-15deg' }, { scale: 1.1 }],
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  bankruptStampText: {
    color: Colors.errorRed,
    fontSize: 20,
    fontFamily: Typography.display,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
