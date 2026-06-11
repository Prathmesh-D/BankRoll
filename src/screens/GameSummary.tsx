import React from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { useGameStore } from '../store/useGameStore';
import { Colors, Typography, Spacing, Radius, Shadows } from '../theme/tokens';
import { formatBalance } from '../domain/currencyFormatter';
import { AVATAR_IMAGES } from '../domain/defaults';

export default function GameSummary() {
  const navigation = useNavigation<any>();
  const { session, endGame, deleteSession } = useGameStore();

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
      ToastAndroid.show('Session code copied!', ToastAndroid.SHORT);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Trophy */}
        <View style={styles.trophyArea}>
          <Text style={styles.trophy}>🏆</Text>
          <Text style={styles.winnerLabel}>Winner</Text>
          <View style={styles.winnerNameRow}>
            {AVATAR_IMAGES[winner.avatar] ? (
              <Image source={AVATAR_IMAGES[winner.avatar]} style={styles.winnerAvatarImage} resizeMode="contain" />
            ) : (
              <Text style={styles.winnerName}>{winner.avatar}</Text>
            )}
            <Text style={styles.winnerName}> {winner.name}</Text>
          </View>
          <Text style={styles.winnerBalance}>
            {formatBalance(winner.balance, editionConfig.currency)}
          </Text>
        </View>

        {/* Leaderboard */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Final Standings</Text>
          {sorted.map((player, index) => (
            <View key={player.id} style={styles.leaderboardRow}>
              <Text style={styles.rank}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
              </Text>
              <View style={[styles.rankAvatar, { backgroundColor: player.color + '22' }]}>
                {AVATAR_IMAGES[player.avatar] ? (
                  <Image source={AVATAR_IMAGES[player.avatar]} style={styles.rankAvatarImage} resizeMode="contain" />
                ) : (
                  <Text style={styles.rankAvatarText}>{player.avatar}</Text>
                )}
              </View>
              <View style={styles.rankInfo}>
                <Text style={styles.rankName}>{player.name}</Text>
                {!player.isActive && <Text style={styles.bankruptTag}>Bankrupt</Text>}
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

        {/* Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📋</Text>
            <Text style={styles.statValue}>{nonReversed.length}</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>💸</Text>
            <Text style={styles.statValue}>{symbol}{(totalTransacted / 1000).toFixed(0)}K</Text>
            <Text style={styles.statLabel}>Total Flow</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⏱</Text>
            <Text style={styles.statValue}>
              {Math.round((session.updatedAt - session.createdAt) / 60000)}m
            </Text>
            <Text style={styles.statLabel}>Game Length</Text>
          </View>
        </View>

        {/* Session Code */}
        <TouchableOpacity 
          style={styles.codeCard} 
          activeOpacity={0.8} 
          onPress={handleCopyCode}
        >
          <Text style={styles.codeLabel}>Session Code</Text>
          <Text style={styles.codeValue}>{session.sessionCode}</Text>
          <Text style={styles.codeNote}>Use this to restore the game later.</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose} activeOpacity={0.85}>
          <Text style={styles.closeButtonText}>Finish Game</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  content: { padding: Spacing.md, gap: Spacing.md, paddingBottom: 32 },
  empty: {
    fontSize: Typography.size.h2, fontFamily: Typography.display,
    color: Colors.ghost, textAlign: 'center', marginTop: 100,
  },
  trophyArea: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  trophy: { fontSize: 64 },
  winnerLabel: {
    fontSize: Typography.size.caption, fontFamily: Typography.bodyMedium,
    color: Colors.ghost, textTransform: 'uppercase', letterSpacing: 2,
  },
  winnerName: {
    fontSize: Typography.size.h1, fontFamily: Typography.display, color: Colors.maroon,
  },
  winnerNameRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
  },
  winnerAvatarImage: {
    width: 32, height: 32,
  },
  winnerBalance: {
    fontSize: Typography.size.balance, fontFamily: Typography.display, color: Colors.gold,
  },
  card: {
    backgroundColor: Colors.parchment, borderRadius: Radius.lg, padding: Spacing.md, gap: Spacing.sm,
  },
  cardTitle: {
    fontSize: Typography.size.caption, fontFamily: Typography.bodyMedium,
    color: Colors.ghost, textTransform: 'uppercase', letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  leaderboardRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.cream, borderRadius: Radius.md, padding: Spacing.sm,
  },
  rank: { fontSize: 20, width: 32, textAlign: 'center' },
  rankAvatar: {
    width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
  },
  rankAvatarImage: { width: 24, height: 24 },
  rankAvatarText: { fontSize: 20 },
  rankInfo: { flex: 1 },
  rankName: { fontSize: Typography.size.body, fontFamily: Typography.bodySemibold, color: Colors.ink },
  bankruptTag: {
    fontSize: Typography.size.micro, fontFamily: Typography.bodyMedium,
    color: Colors.errorRed, marginTop: 2,
  },
  rankBalance: { fontSize: Typography.size.body, fontFamily: Typography.display, color: Colors.maroon },
  rankBalanceNeg: { color: Colors.errorRed },
  rankBalanceBankrupt: { color: Colors.ghost },
  statsGrid: { flexDirection: 'row', gap: Spacing.sm },
  statCard: {
    flex: 1, backgroundColor: Colors.parchment, borderRadius: Radius.lg,
    padding: Spacing.md, alignItems: 'center', gap: 4,
  },
  statIcon: { fontSize: 24 },
  statValue: { fontSize: Typography.size.h2, fontFamily: Typography.display, color: Colors.maroon },
  statLabel: { fontSize: Typography.size.caption, fontFamily: Typography.body, color: Colors.ghost },
  codeCard: {
    backgroundColor: Colors.maroon, borderRadius: Radius.lg, padding: Spacing.md, gap: 4, alignItems: 'center',
  },
  codeLabel: {
    fontSize: Typography.size.caption, fontFamily: Typography.bodyMedium,
    color: Colors.cream + 'AA', textTransform: 'uppercase', letterSpacing: 1,
  },
  codeValue: {
    fontSize: Typography.size.h1, fontFamily: Typography.display, color: Colors.cream, letterSpacing: 6,
  },
  codeNote: { fontSize: Typography.size.caption, fontFamily: Typography.body, color: Colors.cream + '80' },
  footer: { padding: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.creamDark },
  closeButton: {
    height: 56, backgroundColor: Colors.maroon, borderRadius: Radius.full,
    alignItems: 'center', justifyContent: 'center', ...Shadows.fab,
  },
  closeButtonText: {
    fontSize: Typography.size.button, fontFamily: Typography.bodySemibold, color: Colors.cream,
  },
});
