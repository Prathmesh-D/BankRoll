import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Clipboard,
  ToastAndroid,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useGameStore } from '../store/useGameStore';
import { Colors, Typography, Spacing, Shadows } from '../theme/tokens';
import { formatBalance } from '../domain/currencyFormatter';
import { AVATAR_IMAGES } from '../domain/defaults';
import { playSound } from '../utils/SoundManager';

type Nav = NativeStackNavigationProp<RootStackParamList, 'GameSummary'>;
type Route = RouteProp<RootStackParamList, 'GameSummary'>;

export default function GameSummary() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { session, endGame } = useGameStore();

  useEffect(() => {
    if ((route.params as any)?.isEnding) {
      playSound('finish');
    } else {
      playSound('touch');
    }
  }, [(route.params as any)?.isEnding]);

  if (!session) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.empty}>No game to summarise.</Text>
      </SafeAreaView>
    );
  }

  const { entities, transactions, editionConfig } = session;
  const players = entities.filter(e => e.type === 'player');
  const nonReversed = transactions.filter(t => !t.isReversed);

  // Sort by balance (richest first)
  const sorted = [...players].sort((a, b) => b.balance - a.balance);
  const winner = sorted[0];

  const totalTransacted = nonReversed.reduce((sum, t) => sum + t.amount, 0);
  const symbol = editionConfig.currency.symbol;

  const handleClose = () => {
    endGame();
    navigation.navigate('Home');
  };

  const handleCopyCode = () => {
    Clipboard.setString(session.sessionCode);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Code copied!', ToastAndroid.SHORT);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Winner Banner */}
        <View style={styles.winnerCard}>
          <Text style={styles.trophy}>🏆</Text>
          <Text style={styles.winnerLabel}>WINNER</Text>
          <View style={styles.winnerNameRow}>
            {AVATAR_IMAGES[winner.avatar] ? (
              <Image source={AVATAR_IMAGES[winner.avatar]} style={styles.winnerAvatarImage} resizeMode="contain" />
            ) : (
              <Text style={styles.winnerAvatarText}>{winner.avatar}</Text>
            )}
            <Text style={styles.winnerName}>{winner.name}</Text>
          </View>
          <Text style={styles.winnerBalance}>
            {formatBalance(winner.balance, editionConfig.currency)}
          </Text>
        </View>

        {/* Final Standings */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>FINAL STANDINGS</Text>
          {sorted.map((player, index) => (
            <View key={player.id} style={[styles.leaderboardRow, index < sorted.length - 1 && styles.leaderboardRowBorder]}>
              <Text style={styles.rank}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
              </Text>
              <View style={[styles.rankAvatar, { backgroundColor: player.color + '22', borderColor: player.color }]}>
                {AVATAR_IMAGES[player.avatar] ? (
                  <Image source={AVATAR_IMAGES[player.avatar]} style={styles.rankAvatarImage} resizeMode="contain" />
                ) : (
                  <Text style={styles.rankAvatarText}>{player.avatar}</Text>
                )}
              </View>
              <View style={styles.rankInfo}>
                <Text style={styles.rankName}>{player.name}</Text>
                {!player.isActive && <Text style={styles.bankruptTag}>BANKRUPT</Text>}
              </View>
              <Text style={[
                styles.rankBalance,
                player.balance < 0 && styles.rankBalanceNeg,
                !player.isActive && styles.rankBalanceBankrupt,
              ]}>
                {formatBalance(player.balance, editionConfig.currency)}
              </Text>
            </View>
          ))}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📋</Text>
            <Text style={styles.statValue}>{nonReversed.length}</Text>
            <Text style={styles.statLabel}>TRANSACTIONS</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>💸</Text>
            <Text style={styles.statValue}>{symbol}{Math.round(totalTransacted / 1000)}K</Text>
            <Text style={styles.statLabel}>TOTAL FLOW</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⏱</Text>
            <Text style={styles.statValue}>
              {Math.round((session.updatedAt - session.createdAt) / 60000)}m
            </Text>
            <Text style={styles.statLabel}>GAME LENGTH</Text>
          </View>
        </View>

        {/* Session Code — tap to copy */}
        <TouchableOpacity style={styles.codeCard} activeOpacity={0.85} onPress={handleCopyCode}>
          <Text style={styles.codeLabel}>SESSION CODE</Text>
          <Text style={styles.codeValue}>{session.sessionCode}</Text>
          <Text style={styles.codeNote}>Tap to copy · use this code to restore the game</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose} activeOpacity={0.85}>
          <Text style={styles.closeButtonText}>FINISH GAME</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  content: { padding: Spacing.md, gap: Spacing.md, paddingBottom: 32 },
  empty: {
    fontSize: 24, fontFamily: Typography.display,
    color: Colors.ghost, textAlign: 'center', marginTop: 100,
  },
  // ── Winner Card ────────────────────────────────────────────────────────
  winnerCard: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  trophy: { fontSize: 64 },
  winnerLabel: {
    fontSize: 12, fontFamily: Typography.display,
    color: Colors.ghost, letterSpacing: 4,
  },
  winnerNameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  winnerAvatarImage: { width: 64, height: 64 },
  winnerAvatarText: { fontSize: 64 },
  winnerName: {
    fontSize: 40, fontFamily: Typography.display, color: Colors.ink, letterSpacing: 1,
  },
  winnerBalance: {
    fontSize: 40, fontFamily: Typography.display, color: Colors.maroon,
  },
  // ── Final Standings Card ──────────────────────────────────────────────
  card: {
    backgroundColor: Colors.white,
    borderWidth: 4,
    borderColor: Colors.ink,
    ...Shadows.card,
  },
  cardTitle: {
    fontSize: 10, fontFamily: Typography.display,
    color: Colors.ghost, letterSpacing: 3,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: Colors.ink,
  },
  leaderboardRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingHorizontal: Spacing.md, paddingVertical: 12,
  },
  leaderboardRowBorder: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.creamDark,
  },
  rank: { fontSize: 20, width: 32, textAlign: 'center' },
  rankAvatar: {
    width: 36, height: 36, borderRadius: 0,
    borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  rankAvatarImage: { width: 24, height: 24 },
  rankAvatarText: { fontSize: 20 },
  rankInfo: { flex: 1 },
  rankName: { fontSize: 16, fontFamily: Typography.bodySemibold, color: Colors.ink },
  bankruptTag: {
    fontSize: 10, fontFamily: Typography.display,
    color: Colors.errorRed, letterSpacing: 2, marginTop: 2,
  },
  rankBalance: { fontSize: 16, fontFamily: Typography.display, color: Colors.maroon },
  rankBalanceNeg: { color: Colors.errorRed },
  rankBalanceBankrupt: { color: Colors.ghost },
  // ── Stats Grid ────────────────────────────────────────────────────────
  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 4,
    borderColor: Colors.ink,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 4,
    ...Shadows.card,
  },
  statIcon: { fontSize: 24 },
  statValue: { fontSize: 24, fontFamily: Typography.display, color: Colors.maroon },
  statLabel: { fontSize: 8, fontFamily: Typography.body, color: Colors.ghost, letterSpacing: 2 },
  // ── Session Code Card ─────────────────────────────────────────────────
  codeCard: {
    backgroundColor: Colors.ink,
    borderWidth: 4,
    borderColor: Colors.ink,
    padding: Spacing.md,
    gap: 4,
    alignItems: 'center',
    ...Shadows.card,
  },
  codeLabel: {
    fontSize: 10, fontFamily: Typography.display,
    color: Colors.gold, letterSpacing: 4,
  },
  codeValue: {
    fontSize: 36, fontFamily: Typography.display, color: Colors.cream, letterSpacing: 8,
  },
  codeNote: { fontSize: 11, fontFamily: Typography.body, color: Colors.cream + '80' },
  // ── Footer ────────────────────────────────────────────────────────────
  footer: {
    padding: Spacing.md,
    borderTopWidth: 4,
    borderTopColor: Colors.ink,
    backgroundColor: Colors.cream,
  },
  closeButton: {
    height: 56,
    backgroundColor: Colors.maroon,
    borderWidth: 4,
    borderColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.btn,
  },
  closeButtonText: {
    fontSize: 18, fontFamily: Typography.display, color: Colors.cream, letterSpacing: 3,
  },
});
