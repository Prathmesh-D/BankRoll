import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { SetupStackParamList } from '../../navigation/SetupNavigator';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { Colors, Typography, Shadows } from '../../theme/tokens';
import { playSound } from '../../utils/SoundManager';
import { AnimatedPressable } from '../../components/AnimatedPressable';
import { FloatingView } from '../../components/FloatingView';
import { PLAYER_COLOURS, DEFAULT_AVATARS, AVATAR_IMAGES } from '../../domain/defaults';
import { getEditionConfig } from '../../data/editions';
import { useGameStore } from '../../store/useGameStore';

type Route = RouteProp<SetupStackParamList, 'BalanceReview'>;

export default function BalanceReview() {
  const navigation = useNavigation<any>();
  const route = useRoute<Route>();
  const { edition, playerNames, playerAvatars, houseRules, startingBalance: customBalance } = route.params;

  const { initGame } = useGameStore();

  const editionConfig = edition !== 'custom' ? getEditionConfig(edition) : null;
  const salary = (houseRules as any)?.startingBonus ?? editionConfig?.salary ?? 200;
  const startingBalance = customBalance ?? editionConfig?.startingBalance ?? 1500;

  const symbol = editionConfig?.currency.symbol ?? '$';

  const handleLaunch = () => {
    playSound('launchgame');
    initGame({
      edition,
      playerNames,
      playerAvatars,
      playerColors: PLAYER_COLOURS.slice(0, playerNames.length) as string[],
      houseRules: houseRules as any,
      startingBalance,
    });
    navigation.navigate('Dashboard');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.cream} />

      <View style={styles.topBar}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backBtn}
        >
          <Text style={styles.backBtnText}>BACK</Text>
        </TouchableOpacity>

        <View style={styles.progress}>
          {[0, 1, 2, 3].map(i => (
            <View key={i} style={[
              styles.progressDot,
              i < 3 && styles.progressDotDone,
              i === 3 && styles.progressDotActive,
            ]} />
          ))}
        </View>
        <View style={styles.topBarSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.stepLabel}>Step 4 of 4</Text>
        <Text style={styles.title}>Ready to Play!</Text>
        <Text style={styles.subtitle}>Review and launch your game.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Edition</Text>
          <Text style={styles.cardValue}>
            {editionConfig?.name ?? 'Custom'}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Starting Balance</Text>
          <Text style={styles.cardValue}>
            {symbol}{startingBalance.toLocaleString()}
          </Text>
          <Text style={styles.cardSub}>Per player</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>GO Salary</Text>
          <Text style={styles.cardValue}>{symbol}{salary.toLocaleString()}</Text>
        </View>

        <View style={styles.playersCard}>
          <Text style={styles.cardTitle}>Players ({playerNames.length})</Text>
          <View style={styles.playersList}>
            {playerNames.map((name, i) => (
              <View key={i} style={styles.playerRow}>
                <View style={[styles.playerAvatar, { backgroundColor: PLAYER_COLOURS[i] + '22' }]}>
                  {AVATAR_IMAGES[playerAvatars[i] ?? DEFAULT_AVATARS[i]] ? (
                    <Image 
                      source={AVATAR_IMAGES[playerAvatars[i] ?? DEFAULT_AVATARS[i]]} 
                      style={styles.avatarImage} 
                      resizeMode="contain" 
                    />
                  ) : (
                    <Text style={styles.playerAvatarText}>{playerAvatars[i] ?? DEFAULT_AVATARS[i]}</Text>
                  )}
                </View>
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{name}</Text>
                  <Text style={styles.playerBalance}>{symbol}{startingBalance.toLocaleString()}</Text>
                </View>
                <View style={[styles.colourDot, { backgroundColor: PLAYER_COLOURS[i] }]} />
              </View>
            ))}
          </View>
        </View>

        {houseRules && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Active Rules</Text>
            {Object.entries(houseRules as Record<string, unknown>).map(([key, value]) => {
              if (key === 'startingBonus' || key === 'customRules') return null;
              if (!value) return null;
              const labels: Record<string, string> = {
                allowNegative100: '✅ Allow -$100 Overdraft',
                infiniteBankMoney: '✅ Infinite Bank Money',
              };
              return (
                <Text key={key} style={styles.ruleItem}>{labels[key] ?? key}</Text>
              );
            })}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <FloatingView amplitude={4} duration={1800}>
          <AnimatedPressable style={styles.launchButton} onPress={handleLaunch}>
            <Text style={styles.launchButtonText}>Launch Game</Text>
          </AnimatedPressable>
        </FloatingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 48 },
  backBtn: { paddingHorizontal: 12, paddingVertical: 8, borderWidth: 2, borderColor: Colors.ink, backgroundColor: Colors.white, ...Shadows.btn },
  backBtnText: { fontFamily: Typography.display, fontSize: 14, color: Colors.ink, letterSpacing: 1 },
  topBarSpacer: { width: 60 },
  progress: {
    flexDirection: 'row', gap: 6, alignItems: 'center',
  },
  progressDot: { width: 32, height: 8, borderWidth: 2, borderColor: Colors.ink, backgroundColor: Colors.white },
  progressDotActive: { backgroundColor: Colors.ink },
  progressDotDone: { backgroundColor: Colors.ink },
  content: { padding: 24, paddingBottom: 32 },
  stepLabel: {
    fontSize: 10, fontFamily: Typography.bodySemibold,
    color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8,
  },
  title: {
    fontSize: 48, fontFamily: Typography.display,
    color: Colors.ink, marginBottom: 8, letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16, fontFamily: Typography.body, fontStyle: 'italic',
    color: 'rgba(0,0,0,0.6)', marginBottom: 32,
  },
  card: {
    backgroundColor: Colors.white, borderWidth: 2, borderColor: Colors.ink,
    padding: 24, gap: 4, marginBottom: 16,
    ...Shadows.card,
  },
  cardTitle: {
    fontSize: 12, fontFamily: Typography.display,
    color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: 1,
  },
  cardValue: {
    fontSize: 32, fontFamily: Typography.display, color: Colors.ink,
  },
  cardSub: {
    fontSize: 12, fontFamily: Typography.body, color: 'rgba(0,0,0,0.5)', fontStyle: 'italic',
  },
  playersCard: {
    backgroundColor: Colors.white, borderWidth: 2, borderColor: Colors.ink,
    padding: 24, gap: 16, marginBottom: 16,
    ...Shadows.card,
  },
  playersList: { gap: 16 },
  playerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: Colors.cream, borderWidth: 2, borderColor: Colors.ink, padding: 12,
  },
  playerAvatar: {
    width: 48, height: 48, borderWidth: 2, borderColor: Colors.ink,
    alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white,
  },
  playerAvatarText: { fontSize: 24 },
  playerInfo: { flex: 1 },
  playerName: {
    fontSize: 16, fontFamily: Typography.bodySemibold, color: Colors.ink,
  },
  playerBalance: {
    fontSize: 14, fontFamily: Typography.body, color: 'rgba(0,0,0,0.6)',
  },
  colourDot: { width: 24, height: 24, borderWidth: 2, borderColor: Colors.ink },
  ruleItem: {
    fontSize: 16, fontFamily: Typography.body, color: Colors.ink,
    paddingVertical: 4,
  },
  footer: { padding: 24, borderTopWidth: 4, borderTopColor: 'rgba(0,0,0,0.1)' },
  launchButton: {
    height: 64, backgroundColor: Colors.ink,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.ink,
    ...Shadows.btn,
  },
  launchButtonText: {
    fontSize: 24, fontFamily: Typography.display, color: Colors.white, letterSpacing: 2,
  },
  avatarImage: {
    width: 32,
    height: 32,
  },
});
