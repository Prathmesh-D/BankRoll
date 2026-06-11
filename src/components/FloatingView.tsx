import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

interface FloatingViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  amplitude?: number;
  duration?: number;
}

export function FloatingView({ 
  children, 
  style, 
  amplitude = 4, 
  duration = 1500 
}: FloatingViewProps) {
  const floatingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: -amplitude,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ])
    );
    
    animation.start();

    return () => animation.stop();
  }, [floatingAnim, amplitude, duration]);

  return (
    <Animated.View style={[style, { transform: [{ translateY: floatingAnim }] }]}>
      {children}
    </Animated.View>
  );
}
