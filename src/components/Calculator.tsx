import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useCalculatorStore } from '../store/useCalculatorStore';
import { Colors, Typography, Spacing, Radius, Shadows } from '../theme/tokens';

export default function Calculator() {
  const {
    isVisible, display, expression, memory,
    hide, appendDigit, appendDecimal, appendOperator,
    calculate, clear, clearAll,
    memoryStore, memoryRecall, memoryClear,
  } = useCalculatorStore();

  if (!isVisible) return null;

  const renderKey = (label: string, onPress: () => void, variant?: 'operator' | 'equals' | 'pay' | 'memory') => (
    <TouchableOpacity
      key={label}
      style={[styles.key, variant && styles[`key_${variant}` as keyof typeof styles]]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.keyText, variant === 'equals' && styles.keyTextEquals]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={hide} activeOpacity={1} />
      <View style={styles.calculator}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* Display */}
        <View style={styles.display}>
          {expression.length > 0 && (
            <Text style={styles.expression} numberOfLines={1}>{expression}</Text>
          )}
          <Text style={styles.displayValue} numberOfLines={1} adjustsFontSizeToFit>
            {display}
          </Text>
        </View>

        {/* Memory row */}
        <View style={styles.memoryRow}>
          {renderKey('MC', memoryClear, 'memory')}
          {renderKey('MR', memoryRecall, 'memory')}
          {renderKey('M+', memoryStore, 'memory')}
          {renderKey('C', clear, 'memory')}
          {renderKey('AC', clearAll, 'memory')}
        </View>

        {/* Numpad grid */}
        <View style={styles.grid}>
          {renderKey('7', () => appendDigit('7'))}
          {renderKey('8', () => appendDigit('8'))}
          {renderKey('9', () => appendDigit('9'))}
          {renderKey('÷', () => appendOperator('/'), 'operator')}

          {renderKey('4', () => appendDigit('4'))}
          {renderKey('5', () => appendDigit('5'))}
          {renderKey('6', () => appendDigit('6'))}
          {renderKey('×', () => appendOperator('*'), 'operator')}

          {renderKey('1', () => appendDigit('1'))}
          {renderKey('2', () => appendDigit('2'))}
          {renderKey('3', () => appendDigit('3'))}
          {renderKey('−', () => appendOperator('-'), 'operator')}

          {renderKey('0', () => appendDigit('0'))}
          {renderKey('.', appendDecimal)}
          {renderKey('=', calculate, 'equals')}
          {renderKey('+', () => appendOperator('+'), 'operator')}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
    zIndex: 200,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(26,15,15,0.3)',
  },
  calculator: {
    backgroundColor: Colors.cream,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
    paddingHorizontal: Spacing.md,
    ...Shadows.sheet,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.creamDark,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  display: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    minHeight: 80,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  expression: {
    fontSize: Typography.size.caption,
    fontFamily: Typography.body,
    color: Colors.ghost,
  },
  displayValue: {
    fontSize: 40,
    fontFamily: Typography.display,
    color: Colors.maroon,
  },
  memoryRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  key: {
    width: '23%',
    height: 54,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.btn,
  },
  key_operator: {
    backgroundColor: '#FEF3C7',
  },
  key_equals: {
    backgroundColor: '#F0FDF4',
    borderColor: Colors.green,
  },
  key_memory: {
    flex: 1,
    height: 40,
    backgroundColor: Colors.creamDark,
  },
  keyText: {
    fontSize: 24,
    fontFamily: Typography.display,
    color: Colors.ink,
  },
  keyTextEquals: {
    color: Colors.green,
  },
});
