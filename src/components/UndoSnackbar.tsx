import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Colors, Typography, Spacing, Radius, ComponentSizes } from '../theme/tokens';

interface Props {
  message: string;
  onUndo: () => void;
  durationMs?: number;
  visible: boolean;
}

export default function UndoSnackbar({ message, onUndo, durationMs = 15000, visible }: Props) {
  const timerWidth = useRef(new Animated.Value(1)).current;
  const slideY = useRef(new Animated.Value(80)).current;

  useEffect(() => {
    if (visible) {
      // Slide up
      Animated.timing(slideY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Timer bar shrinks
      timerWidth.setValue(1);
      Animated.timing(timerWidth, {
        toValue: 0,
        duration: durationMs,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(slideY, {
        toValue: 80,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, durationMs, slideY, timerWidth]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: slideY }] }]}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>↩</Text>
        <Text style={styles.message} numberOfLines={1}>{message}</Text>
        <TouchableOpacity onPress={onUndo} style={styles.undoButton} activeOpacity={0.8}>
          <Text style={styles.undoText}>UNDO</Text>
        </TouchableOpacity>
      </View>
      <Animated.View
        style={[
          styles.timerBar,
          {
            width: timerWidth.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    left: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.maroon,
    borderRadius: Radius.md,
    overflow: 'hidden',
    shadowColor: Colors.maroon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  icon: {
    fontSize: 16,
    color: Colors.cream,
  },
  message: {
    flex: 1,
    fontSize: Typography.size.body,
    fontFamily: Typography.body,
    color: Colors.cream,
  },
  undoButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  undoText: {
    fontSize: Typography.size.button,
    fontFamily: Typography.bodySemibold,
    color: Colors.gold,
  },
  timerBar: {
    height: 3,
    backgroundColor: Colors.gold,
    alignSelf: 'flex-start',
  },
});
