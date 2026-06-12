import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  SafeAreaView,
  Image,
} from 'react-native';
import { Colors, Typography, Spacing, Shadows } from '../theme/tokens';
import { AVATAR_IMAGES } from '../domain/defaults';
import type { Transaction } from '../types/transaction';
import type { Entity } from '../types/entity';
import type { CurrencyConfig } from '../types/edition';

interface Props {
  transactions: Transaction[];
  entities: Entity[];
  currency: CurrencyConfig;
  undoStack: Array<{ transactionId: string; expiresAt: number }>;
  onUndo: (txId: string) => void;
  onClose: () => void;
}

const formatRetroBalance = (amount: number, currency: CurrencyConfig) => {
  const abs = Math.abs(amount).toString();
  return `${currency.symbol}${abs}`;
};

const TransactionRow = React.memo(({ 
  tx, 
  index, 
  from, 
  to, 
  currency, 
  onUndo, 
  canUndo,
  totalCount, 
  now 
}: {
  tx: Transaction;
  index: number;
  from?: Entity;
  to?: Entity;
  currency: CurrencyConfig;
  onUndo: (id: string) => void;
  canUndo: boolean;
  totalCount: number;
  now: number;
}) => {
  const formatTimeAgo = (timestamp: number) => {
    const diff = Math.floor((now - timestamp) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    return `${Math.floor(diff / 3600)} hr ago`;
  };

  return (
    <View style={styles.txWrapper}>
      <View style={[styles.card, tx.isReversed && styles.cardReversed]}>
        <View style={[styles.colorBarLeft, { backgroundColor: from?.color || Colors.ink }]} />
        <View style={[styles.colorBarRight, { backgroundColor: to?.color || Colors.ink }]} />
        
        <View style={styles.cardHeader}>
          <Text style={styles.timeText}>{formatTimeAgo(tx.timestamp)} • #{totalCount - index}</Text>
          <View style={styles.headerRightControls}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{tx.type}</Text>
            </View>
            {!tx.isReversed && canUndo && (
              <TouchableOpacity style={styles.revertBtn} onPress={() => onUndo(tx.id)}>
                <Text style={styles.revertBtnText}>UNDO</Text>
              </TouchableOpacity>
            )}
            {!tx.isReversed && !canUndo && (
              <View style={styles.finalBadge}>
                <Text style={styles.finalBadgeText}>FINAL</Text>
              </View>
            )}
            {tx.isReversed && (
              <Text style={styles.revertedBadge}>REVERTED</Text>
            )}
          </View>
        </View>

        <View style={styles.grid}>
          {/* From */}
          <View style={styles.entityCol}>
            <View style={[styles.avatarBox, { backgroundColor: from?.color ? from.color + '1A' : Colors.ink + '1A' }]}>
              {from?.avatar && AVATAR_IMAGES[from.avatar] ? (
                <Image source={AVATAR_IMAGES[from.avatar]} style={styles.avatarImage} resizeMode="contain" />
              ) : (
                <Text style={styles.avatar}>{from?.avatar}</Text>
              )}
            </View>
            <Text style={styles.entityName} numberOfLines={1}>{from?.name}</Text>
          </View>

          {/* Amount */}
          <View style={styles.amountCol}>
            <Text style={styles.arrowIcon}>→</Text>
            <Text style={styles.amount}>{formatRetroBalance(tx.amount, currency)}</Text>
          </View>

          {/* To */}
          <View style={styles.entityCol}>
            <View style={[styles.avatarBox, { backgroundColor: to?.color ? to.color + '1A' : Colors.ink + '1A' }]}>
              {to?.avatar && AVATAR_IMAGES[to.avatar] ? (
                <Image source={AVATAR_IMAGES[to.avatar]} style={styles.avatarImage} resizeMode="contain" />
              ) : (
                <Text style={styles.avatar}>{to?.avatar}</Text>
              )}
            </View>
            <Text style={styles.entityName} numberOfLines={1}>{to?.name}</Text>
          </View>
        </View>

        {tx.label && (
          <Text style={styles.txLabel}>{tx.label}</Text>
        )}
      </View>
    </View>
  );
});

export default function TransactionLog({
  transactions,
  entities,
  currency,
  undoStack,
  onUndo,
  onClose,
}: Props) {
  // Update 'now' every second so time-ago labels and canUndo check stay fresh
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const sortedTransactions = React.useMemo(() => {
    return [...transactions].sort((a, b) => b.timestamp - a.timestamp);
  }, [transactions]);

  const displayTransactions = React.useMemo(() => {
    return sortedTransactions.filter(tx => tx.type !== 'REVERSAL');
  }, [sortedTransactions]);

  const getEntity = React.useCallback((id: string) => entities.find(e => e.id === id), [entities]);

  const renderItem = React.useCallback(({ item: tx, index }: { item: Transaction, index: number }) => {
    const from = getEntity(tx.fromEntityId);
    const to = getEntity(tx.toEntityId);
    // REVERT is available only while the undo window is open
    const undoEntry = undoStack.find(e => e.transactionId === tx.id);
    const canUndo = !tx.isReversed && !!undoEntry && now < undoEntry.expiresAt;
    return (
      <TransactionRow
        tx={tx}
        index={index}
        from={from}
        to={to}
        currency={currency}
        onUndo={onUndo}
        canUndo={canUndo}
        totalCount={displayTransactions.length}
        now={now}
      />
    );
  }, [getEntity, currency, onUndo, undoStack, displayTransactions.length, now]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerEyebrow}>Audit Trail</Text>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Transaction Log</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{transactions.length}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeBtnText}>X</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <FlatList
        data={displayTransactions}
        keyExtractor={tx => tx.id}
        style={styles.content}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={5}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No transactions yet</Text>
          </View>
        }
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 24,
    borderBottomWidth: 4,
    borderBottomColor: Colors.ink,
    backgroundColor: Colors.cream,
    zIndex: 10,
  },
  headerLeft: {},
  headerEyebrow: {
    fontSize: 10,
    fontFamily: Typography.bodySemibold,
    color: 'rgba(0,0,0,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontFamily: Typography.display,
    color: Colors.ink,
    letterSpacing: 1,
  },
  countBadge: {
    backgroundColor: Colors.ink,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 2,
    marginTop: 4,
  },
  countText: {
    color: Colors.white,
    fontFamily: Typography.display,
    fontSize: 14,
    letterSpacing: 2,
  },
  closeBtn: {
    width: 48,
    height: 48,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.btn,
  },
  closeBtnText: {
    fontSize: 20,
    fontFamily: Typography.bodySemibold,
    color: Colors.ink,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  list: {
    gap: 24,
    paddingBottom: 40,
  },
  txWrapper: {
    gap: 16,
  },
  card: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.ink,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
    ...Shadows.card,
  },
  cardReversed: {
    opacity: 0.5,
  },
  colorBarLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 6,
    height: '200%', // overflow ensures full coverage
  },
  colorBarRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 6,
    height: '200%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeText: {
    fontSize: 10,
    fontFamily: Typography.bodySemibold,
    color: 'rgba(0,0,0,0.4)',
  },
  typeBadge: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  typeText: {
    fontSize: 10,
    fontFamily: Typography.display,
    color: Colors.ink,
    letterSpacing: 1,
  },
  headerRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  revertBtn: {
    backgroundColor: Colors.errorRed,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.ink,
  },
  revertBtnText: {
    fontSize: 10,
    fontFamily: Typography.display,
    color: Colors.white,
    letterSpacing: 1,
  },
  finalBadge: {
    backgroundColor: Colors.creamDark,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  finalBadgeText: {
    fontSize: 10,
    fontFamily: Typography.display,
    color: 'rgba(0,0,0,0.4)',
    letterSpacing: 1,
  },
  revertedBadge: {
    fontSize: 10,
    fontFamily: Typography.bodySemibold,
    color: Colors.errorRed,
    letterSpacing: 1,
  },
  grid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  entityCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  avatarBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    fontSize: 32,
  },
  avatarImage: {
    width: 40,
    height: 40,
  },
  entityName: {
    fontSize: 10,
    fontFamily: Typography.bodySemibold,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  amountCol: {
    alignItems: 'center',
    gap: 8,
  },
  arrowIcon: {
    fontSize: 24,
    color: 'rgba(0,0,0,0.2)',
  },
  amount: {
    fontSize: 32,
    fontFamily: Typography.display,
    color: Colors.ink,
    letterSpacing: 1,
  },
  txLabel: {
    marginTop: 12,
    fontSize: 12,
    fontFamily: Typography.bodyMedium,
    color: 'rgba(0,0,0,0.5)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: Typography.display,
    fontSize: 24,
    color: 'rgba(0,0,0,0.3)',
  },
});
