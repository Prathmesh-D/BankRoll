import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { SetupStackParamList } from '../../navigation/SetupNavigator';
import { playSound } from '../../utils/SoundManager';
import { Colors, Typography, Shadows } from '../../theme/tokens';
import { PLAYER_COLOURS, DEFAULT_AVATARS, AVATAR_IMAGES } from '../../domain/defaults';
import { AnimatedPressable } from '../../components/AnimatedPressable';
import { FloatingView } from '../../components/FloatingView';

type Nav = NativeStackNavigationProp<SetupStackParamList, 'PlayerSetup'>;
type Route = RouteProp<SetupStackParamList, 'PlayerSetup'>;

const MAX_PLAYERS = 8;
const MIN_PLAYERS = 2;

export default function PlayerSetup() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { edition } = route.params;

  const [playerCount, setPlayerCount] = useState(4);
  const [names, setNames] = useState<string[]>(
    Array.from({ length: 8 }, () => '')
  );
  const [avatars, setAvatars] = useState<string[]>(
    DEFAULT_AVATARS.map(a => a)
  );

  const updateName = useCallback((index: number, name: string) => {
    setNames(prev => {
      const next = [...prev];
      next[index] = name;
      return next;
    });
  }, []);

  const cycleAvatar = useCallback((index: number) => {
    setAvatars(prev => {
      const next = [...prev];
      const currentIdx = DEFAULT_AVATARS.indexOf(next[index] as any);
      next[index] = DEFAULT_AVATARS[(currentIdx + 1) % DEFAULT_AVATARS.length];
      return next;
    });
  }, []);

  const playerNames = names.slice(0, playerCount).map((n, i) => n || `Player ${i + 1}`);
  const playerAvatars = avatars.slice(0, playerCount);

  const hasDuplicateNames = new Set(playerNames.map(n => n.trim().toLowerCase())).size !== playerNames.length;

  const handleNext = () => {
    if (hasDuplicateNames) {
      playSound('wompwomp');
      return;
    }

    playSound('touch');
    navigation.navigate('HouseRulesSetup', {
      edition,
      playerNames,
      playerAvatars,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView 
        style={styles.flex1} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backBtn}
          >
            <Text style={styles.backBtnText}>BACK</Text>
          </TouchableOpacity>

          {/* Progress */}
          <View style={styles.progress}>
            <View style={styles.progressDot} />
            <View style={[styles.progressDot, styles.progressDotActive]} />
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
          </View>
          <View style={styles.topBarSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.stepLabel}>Step 2 of 4</Text>
          <Text style={styles.title}>Players</Text>
          <Text style={styles.subtitle}>Who's playing?</Text>

          {/* Player count */}
          <View style={styles.countRow}>
            <Text style={styles.countLabel}>Number of Players</Text>
            <View style={styles.counter}>
              <TouchableOpacity
                style={styles.counterBtn}
                activeOpacity={0.7}
                onPress={() => { playSound('touch'); setPlayerCount(Math.max(MIN_PLAYERS, playerCount - 1)); }}
                disabled={playerCount <= MIN_PLAYERS}
              >
                <Text style={styles.counterBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.counterValue}>{playerCount}</Text>
              <TouchableOpacity
                style={styles.counterBtn}
                activeOpacity={0.7}
                onPress={() => { playSound('touch'); setPlayerCount(Math.min(MAX_PLAYERS, playerCount + 1)); }}
                disabled={playerCount >= MAX_PLAYERS}
              >
                <Text style={styles.counterBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Player name inputs */}
          <View style={styles.playerList}>
            {Array.from({ length: playerCount }).map((_, i) => (
              <View key={i} style={styles.playerRow}>
                {/* Avatar selector */}
                <TouchableOpacity
                  style={[styles.avatarCircle, { backgroundColor: Colors.cream, borderColor: PLAYER_COLOURS[i] }]}
                  onPress={() => { playSound('touch'); cycleAvatar(i); }}
                >
                  {DEFAULT_AVATARS.map((avatarId) => (
                    <Image 
                      key={avatarId}
                      source={AVATAR_IMAGES[avatarId]} 
                      style={[
                        styles.avatarImage, 
                        styles.avatarImageAbsolute,
                        { opacity: avatars[i] === avatarId ? 1 : 0 }
                      ]} 
                      resizeMode="contain" 
                    />
                  ))}
                </TouchableOpacity>

                {/* Name input */}
                <TextInput
                  style={styles.nameInput}
                  placeholder={`Player ${i + 1}`}
                  placeholderTextColor={Colors.ghost}
                  value={names[i]}
                  onChangeText={(text) => updateName(i, text)}
                  maxLength={20}
                  returnKeyType="next"
                />

                {/* Colour dot */}
                <View style={[styles.colourDot, { backgroundColor: PLAYER_COLOURS[i] }]} />
              </View>
            ))}
          </View>

          <Text style={styles.avatarHint}>Tap avatar to cycle through unique tokens</Text>
        </ScrollView>

        <View style={styles.footer}>
          {hasDuplicateNames && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>ALL PLAYERS MUST HAVE A UNIQUE NAME</Text>
            </View>
          )}
          <FloatingView amplitude={4} duration={1800}>
            <AnimatedPressable style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Continue</Text>
            </AnimatedPressable>
          </FloatingView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  safe: { flex: 1, backgroundColor: Colors.parchment },
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
  countRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, borderWidth: 2, borderColor: Colors.ink, padding: 16,
    marginBottom: 24,
    ...Shadows.card,
  },
  countLabel: {
    fontSize: 14, fontFamily: Typography.display, color: Colors.ink, letterSpacing: 1,
  },
  counter: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  counterBtn: {
    width: 40, height: 40, backgroundColor: Colors.white, borderWidth: 2, borderColor: Colors.ink,
    alignItems: 'center', justifyContent: 'center',
    ...Shadows.btn,
  },
  counterBtnText: {
    fontSize: 24, fontFamily: Typography.display, color: Colors.ink,
  },
  counterValue: {
    fontSize: 32, fontFamily: Typography.display, color: Colors.ink,
    minWidth: 32, textAlign: 'center',
  },
  playerList: { gap: 16 },
  playerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: Colors.white, borderWidth: 2, borderColor: Colors.ink, padding: 16,
    ...Shadows.card,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  avatarImage: { width: 40, height: 40 },
  avatarText: { fontSize: 32 },
  nameInput: {
    flex: 1, height: 48,
    fontSize: 20, fontFamily: Typography.display,
    color: Colors.ink, letterSpacing: 1,
    borderBottomWidth: 2, borderBottomColor: Colors.ink,
  },
  colourDot: {
    width: 24, height: 24, borderWidth: 2, borderColor: Colors.ink, flexShrink: 0,
  },
  avatarHint: {
    fontSize: 12, fontFamily: Typography.bodySemibold, color: 'rgba(0,0,0,0.4)',
    textAlign: 'center', marginTop: 24, textTransform: 'uppercase', letterSpacing: 1,
  },
  footer: { padding: 24, borderTopWidth: 4, borderTopColor: 'rgba(0,0,0,0.1)' },
  nextButton: {
    height: 64, backgroundColor: Colors.gold,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.ink,
    ...Shadows.btn,
  },
  nextButtonText: {
    fontSize: 24, fontFamily: Typography.display, color: Colors.ink, letterSpacing: 2,
  },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 48 },
  backBtn: { paddingHorizontal: 12, paddingVertical: 8, borderWidth: 2, borderColor: Colors.ink, backgroundColor: Colors.white, ...Shadows.btn },
  backBtnText: { fontFamily: Typography.display, fontSize: 14, color: Colors.ink, letterSpacing: 1 },
  topBarSpacer: { width: 60 },
  avatarImageAbsolute: { position: 'absolute' },
  errorBox: {
    backgroundColor: Colors.errorRed,
    padding: 12,
    borderWidth: 2,
    borderColor: Colors.ink,
    marginBottom: 16,
    ...Shadows.card,
  },
  errorText: {
    fontFamily: Typography.display,
    fontSize: 14,
    color: Colors.white,
    textAlign: 'center',
    letterSpacing: 1,
  },
});
