import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EditionSelector from '../screens/SetupWizard/EditionSelector';
import PlayerSetup from '../screens/SetupWizard/PlayerSetup';
import HouseRulesSetup from '../screens/SetupWizard/HouseRulesSetup';
import BalanceReview from '../screens/SetupWizard/BalanceReview';

export type SetupStackParamList = {
  EditionSelector: undefined;
  PlayerSetup: { edition: string };
  HouseRulesSetup: { edition: string; playerNames: string[]; playerAvatars: string[] };
  BalanceReview: {
    edition: string;
    playerNames: string[];
    playerAvatars: string[];
    houseRules?: Record<string, unknown>;
    startingBalance?: number;
  };
};

const Stack = createNativeStackNavigator<SetupStackParamList>();

export default function SetupNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="EditionSelector"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#FFFCF5' },
      }}
    >
      <Stack.Screen name="EditionSelector" component={EditionSelector} />
      <Stack.Screen name="PlayerSetup" component={PlayerSetup} />
      <Stack.Screen name="HouseRulesSetup" component={HouseRulesSetup} />
      <Stack.Screen name="BalanceReview" component={BalanceReview} />
    </Stack.Navigator>
  );
}
