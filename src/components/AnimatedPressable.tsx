import React from 'react';
import { Pressable, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface AnimatedPressableProps {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  activeScale?: number;
  disabled?: boolean;
}

/**
 * AnimatedPressable — migrated from Animated (JS thread) to Reanimated (UI thread).
 * This eliminates dropped frames during drag operations on the Dashboard,
 * since the scale animation now runs natively without JS involvement.
 */
export function AnimatedPressable({
  onPress,
  style,
  containerStyle,
  children,
  activeScale = 0.96,
  disabled = false,
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(activeScale, {
      damping: 15,
      stiffness: 400,
      mass: 0.5,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 400,
      mass: 0.5,
    });
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={containerStyle}
    >
      <Animated.View style={[style, animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
