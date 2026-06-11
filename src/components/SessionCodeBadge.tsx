import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Clipboard,
  ToastAndroid,
  Platform,
  Share,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { Colors, Typography, Spacing, Radius } from '../theme/tokens';

interface Props {
  code: string;
}

export default function SessionCodeBadge({ code }: Props) {
  const scale = useSharedValue(1);
  const borderColor = useSharedValue(Colors.ink);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: borderColor.value,
  }));

  const handleTap = useCallback(async () => {
    // Copy to clipboard
    Clipboard.setString(code);

    // Flash animation
    scale.value = withSequence(
      withTiming(1.1, { duration: 80 }),
      withSpring(1, { damping: 15, stiffness: 300 })
    );

    if (Platform.OS === 'android') {
      ToastAndroid.show('Code copied!', ToastAndroid.SHORT);
    }
  }, [code, scale]);

  const handleLongPress = useCallback(async () => {
    await Share.share({
      message: `Restore this BankRoll game: ${code}`,
      title: 'BankRoll Session Code',
    });
  }, [code]);

  return (
    <TouchableOpacity
      onPress={handleTap}
      onLongPress={handleLongPress}
      activeOpacity={0.8}
      accessibilityLabel={`Session code ${code}. Tap to copy.`}
      accessibilityHint="Long press to share"
    >
      <Animated.View style={[styles.badge, animatedStyle]}>
        <Text style={styles.icon}>📋</Text>
        <Text style={styles.code}>{code}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.ink,
    backgroundColor: Colors.white,
    gap: 4,
    shadowColor: Colors.ink,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  icon: {
    fontSize: 12,
  },
  code: {
    fontSize: 14,
    fontFamily: Typography.display,
    color: Colors.ink,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
