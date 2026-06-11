import 'react-native-gesture-handler';
import './src/setup'; // Polyfills first
import React, { useEffect } from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import { initSounds, playSound } from './src/utils/SoundManager';

export default function App() {
  useEffect(() => {
    initSounds();
  }, []);

  return <RootNavigator />;
}
