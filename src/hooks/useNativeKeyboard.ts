import { useEffect, useRef } from 'react';
import { Animated, Keyboard, Platform } from 'react-native';

/**
 * A safe, Native-Driver powered keyboard height hook that doesn't use Reanimated.
 * This completely prevents the React 19 / Reanimated "frozen object" DEV crashes,
 * while still providing buttery smooth 60fps keyboard tracking!
 */
export function useNativeKeyboard() {
  const keyboardHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // iOS and modern Android (11+) support WillShow for perfect syncing
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        Animated.timing(keyboardHeight, {
          toValue: e.endCoordinates.height,
          duration: e.duration || 250,
          useNativeDriver: true,
        }).start();
      }
    );

    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      (e) => {
        Animated.timing(keyboardHeight, {
          toValue: 0,
          duration: e.duration || 250,
          useNativeDriver: true,
        }).start();
      }
    );

    // Some newer Androids actually do support WillShow natively now
    const willShowSub = Keyboard.addListener('keyboardWillShow', (e) => {
      Animated.timing(keyboardHeight, {
        toValue: e.endCoordinates.height,
        duration: e.duration || 250,
        useNativeDriver: true,
      }).start();
    });

    const willHideSub = Keyboard.addListener('keyboardWillHide', (e) => {
      Animated.timing(keyboardHeight, {
        toValue: 0,
        duration: e.duration || 250,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
      willShowSub.remove();
      willHideSub.remove();
    };
  }, [keyboardHeight]);

  return keyboardHeight;
}
