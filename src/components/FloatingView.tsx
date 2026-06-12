import React, { useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';

interface FloatingViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  amplitude?: number;
  duration?: number;
}

/**
 * FloatingView — migrated from Animated (JS thread) to Reanimated (UI thread).
 * The looping float animation now runs natively.
 */
export function FloatingView({
  children,
  style,
  amplitude = 4,
  duration = 1500,
}: FloatingViewProps) {
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-amplitude, { duration: duration / 2 }),
        withTiming(0, { duration: duration / 2 })
      ),
      -1, // infinite
      false
    );

    return () => {
      cancelAnimation(translateY);
    };
  }, [translateY, amplitude, duration]);

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
}
