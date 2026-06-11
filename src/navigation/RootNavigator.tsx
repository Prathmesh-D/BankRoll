import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Host } from 'react-native-portalize';
import { StyleSheet } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import Dashboard from '../screens/Dashboard';
import SessionHistory from '../screens/SessionHistory';
import GameSummary from '../screens/GameSummary';
import SetupNavigator from './SetupNavigator';
import Calculator from '../components/Calculator';

export type RootStackParamList = {
  Home: undefined;
  SetupWizard: undefined;
  Dashboard: undefined;
  SessionHistory: undefined;
  GameSummary: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <Host>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerShown: false,
                animation: 'fade',
                contentStyle: { backgroundColor: '#FFFCF5' },
              }}
            >
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen
                name="SetupWizard"
                component={SetupNavigator}
                options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
              />
              <Stack.Screen
                name="Dashboard"
                component={Dashboard}
                options={{ animation: 'fade' }}
              />
              <Stack.Screen
                name="SessionHistory"
                component={SessionHistory}
                options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
              />
              <Stack.Screen
                name="GameSummary"
                component={GameSummary}
                options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
          {/* Global Calculator overlay — mounted at root for any-screen access */}
          <Calculator />
        </Host>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
