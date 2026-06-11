import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Typography, Spacing, Radius } from '../theme/tokens';
import { Springs } from '../theme/animations';
import { formatChip } from '../domain/currencyFormatter';

interface Props {
  amount: number;
  symbol: string;
  isSelected?: boolean;
  count?: number;  // How many times selected (for additive taps)
  onPress: (amount: number) => void;
}

export default function DenominationChip({ amount, symbol, isSelected, count = 0, onPress }: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    scale.value = withSpring(0.95, Springs.snappy, () => {
      scale.value = withSpring(1, Springs.snappy);
    });
    onPress(amount);
  }, [amount, onPress, scale]);

  const label = formatChip(amount, symbol);

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <Animated.View style={[styles.chip, isSelected && styles.chipSelected, animatedStyle]}>
        <Text style={[styles.label, isSelected && styles.labelSelected]}>
          {label}
        </Text>
        {count > 1 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>×{count}</Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 48,
    minWidth: 72,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.parchment,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
    borderWidth: 1.5,
    borderColor: Colors.creamDark,
  },
  chipSelected: {
    backgroundColor: Colors.maroon,
    borderColor: Colors.maroon,
  },
  label: {
    fontSize: Typography.size.button,
    fontFamily: Typography.bodySemibold,
    color: Colors.maroon,
  },
  labelSelected: {
    color: Colors.cream,
  },
  badge: {
    backgroundColor: Colors.gold,
    borderRadius: Radius.full,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  badgeText: {
    fontSize: Typography.size.micro,
    fontFamily: Typography.bodyMedium,
    color: Colors.maroon,
  },
});
