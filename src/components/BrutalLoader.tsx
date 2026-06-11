import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import { Colors, Typography, Shadows } from '../theme/tokens';

interface BrutalLoaderProps {
  visible: boolean;
  message?: string;
}

export function BrutalLoader({ visible, message = 'LOADING...' }: BrutalLoaderProps) {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      progressAnim.setValue(0);
      Animated.loop(
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        })
      ).start();
    } else {
      progressAnim.stopAnimation();
    }
  }, [visible, progressAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.messageText}>{message}</Text>
          <View style={styles.barContainer}>
            <Animated.View style={[styles.barFill, { width: progressWidth }]} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  card: {
    backgroundColor: Colors.white,
    borderWidth: 4,
    borderColor: Colors.ink,
    padding: 24,
    width: '100%',
    ...Shadows.card,
  },
  messageText: {
    fontFamily: Typography.display,
    fontSize: 24,
    color: Colors.ink,
    marginBottom: 16,
    letterSpacing: 2,
    textAlign: 'center',
  },
  barContainer: {
    height: 24,
    borderWidth: 2,
    borderColor: Colors.ink,
    backgroundColor: Colors.cream,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.gold,
    borderRightWidth: 2,
    borderColor: Colors.ink,
  },
});
