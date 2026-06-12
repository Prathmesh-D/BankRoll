import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useGameStore } from '../store/useGameStore';
import { Colors, Typography, Spacing, Shadows } from '../theme/tokens';
import type { SessionSummary } from '../types/session';

type Nav = NativeStackNavigationProp<RootStackParamList, 'SessionHistory'>;

const EDITION_FLAGS: Record<string, string> = {
  standard_us: '🇺🇸',
  standard_uk: '🇬🇧',
  standard_in: '🇮🇳',
  custom: '⚙️',
};

export default function SessionHistory() {
  const navigation = useNavigation<Nav>();
  const { sessionHistory, restoreSession, deleteSession } = useGameStore();

  const handleRestore = useCallback((summary: SessionSummary) => {
    const result = restoreSession(summary.sessionCode);
    if (result === 'ok') navigation.navigate('Dashboard');
  }, [restoreSession, navigation]);

  const handleDelete = useCallback((summary: SessionSummary) => {
    Alert.alert(
      'Delete Session',
      `Delete ${summary.sessionCode}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteSession(summary.id),
        },
      ]
    );
  }, [deleteSession]);

  const renderItem = useCallback(({ item }: { item: SessionSummary }) => {
    const d = new Date(item.updatedAt);
    const dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const statusColors = {
      active: Colors.gold,
      ended: Colors.ghost,
      archived: Colors.ghost,
    };

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleRestore(item)}
        onLongPress={() => handleDelete(item)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.flag}>{EDITION_FLAGS[item.edition] ?? '🎲'}</Text>
          <View style={styles.cardInfo}>
            <Text style={styles.code}>{item.sessionCode}</Text>
            <Text style={styles.players}>
              {item.playerNames.slice(0, 4).join(', ')}
              {item.playerNames.length > 4 ? ` +${item.playerNames.length - 4}` : ''}
            </Text>
          </View>
          <View style={styles.cardMeta}>
            <View style={[styles.statusDot, { backgroundColor: statusColors[item.status] }]} />
            <Text style={styles.dateStr}>{dateStr}</Text>
          </View>
        </View>
        <View style={styles.cardStats}>
          <Text style={styles.stat}>{item.transactionCount} transactions</Text>
          <Text style={styles.statSep}>·</Text>
          <Text style={[styles.stat, { color: statusColors[item.status] }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }, [handleRestore, handleDelete]);
  const itemSeparator = React.useCallback(() => <View style={styles.separator} />, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Past Games</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Text style={styles.closeText}>Done</Text>
        </TouchableOpacity>
      </View>

      {sessionHistory.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🎩</Text>
          <Text style={styles.emptyTitle}>No games yet</Text>
          <Text style={styles.emptySubtitle}>Your completed games will appear here.</Text>
        </View>
      ) : (
        <FlatList
          data={sessionHistory}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={itemSeparator}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.parchment },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.creamDark,
    backgroundColor: Colors.cream,
  },
  title: { fontSize: Typography.size.h1, fontFamily: Typography.display, color: Colors.maroon },
  closeButton: { paddingHorizontal: Spacing.sm },
  closeText: { fontSize: Typography.size.body, fontFamily: Typography.bodySemibold, color: Colors.maroon },
  list: { padding: Spacing.md },
  card: {
    backgroundColor: Colors.cream,
    borderWidth: 4,
    borderColor: Colors.ink,
    padding: Spacing.md,
    gap: Spacing.xs,
    ...Shadows.card,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  flag: { fontSize: 24 },
  cardInfo: { flex: 1 },
  code: { fontSize: Typography.size.body, fontFamily: Typography.bodySemibold, color: Colors.maroon },
  players: { fontSize: Typography.size.caption, fontFamily: Typography.body, color: Colors.ghost, marginTop: 2 },
  cardMeta: { alignItems: 'flex-end', gap: 4 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  dateStr: { fontSize: Typography.size.micro, fontFamily: Typography.body, color: Colors.ghost },
  cardStats: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  stat: { fontSize: Typography.size.caption, fontFamily: Typography.body, color: Colors.ghost },
  statSep: { fontSize: Typography.size.caption, color: Colors.ghost },
  separator: { height: Spacing.sm },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.sm },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: Typography.size.h1, fontFamily: Typography.display, color: Colors.maroon },
  emptySubtitle: {
    fontSize: Typography.size.body, fontFamily: Typography.body, color: Colors.ghost, textAlign: 'center',
  },
});
