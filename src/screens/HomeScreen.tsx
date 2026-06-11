import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  Animated,
  TextInput,
  Image,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useGameStore } from '../store/useGameStore';
import { Colors, Typography, Spacing, Radius, Shadows } from '../theme/tokens';
import { AnimatedPressable } from '../components/AnimatedPressable';
import { FloatingView } from '../components/FloatingView';
import type { SessionSummary } from '../types/session';
import { BrutalLoader } from '../components/BrutalLoader';
import { playSound } from '../utils/SoundManager';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { session, sessionHistory, restoreSession, deleteSession } = useGameStore();

  const [codeInput, setCodeInput] = useState('');
  const [restoreError, setRestoreError] = useState('');
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Title fade-in animation
  const titleOpacity = React.useRef(new Animated.Value(0)).current;
  const titleY = React.useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(titleOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(titleY, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, [titleOpacity, titleY]);

  const handleNewGame = useCallback(() => {
    playSound('GameStart');
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      navigation.navigate('SetupWizard');
    }, 600);
  }, [navigation]);

  const handleResumeGame = useCallback(() => {
    navigation.navigate('Dashboard');
  }, [navigation]);

  const handleRestoreCode = useCallback(() => {
    if (codeInput.length < 6) {
      setRestoreError('Enter a 6-character code');
      return;
    }
    setIsConnecting(true);
    setTimeout(() => {
      const result = restoreSession(codeInput.toUpperCase().trim());
      setIsConnecting(false);
      if (result === 'ok') {
        setRestoreError('');
        const status = useGameStore.getState().session?.status;
        if (status === 'ended') navigation.navigate('GameSummary');
        else navigation.navigate('Dashboard');
      } else {
        setRestoreError('No game found.');
      }
    }, 800);
  }, [codeInput, restoreSession, navigation]);

  const handleSessionRestore = useCallback((summary: SessionSummary) => {
    setIsConnecting(true);
    setTimeout(() => {
      const result = restoreSession(summary.sessionCode);
      setIsConnecting(false);
      if (result === 'ok') {
        const restoredStatus = useGameStore.getState().session?.status;
        if (restoredStatus === 'ended') {
          navigation.navigate('GameSummary');
        } else {
          navigation.navigate('Dashboard');
        }
      }
    }, 500);
  }, [restoreSession, navigation]);

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const EDITION_FLAGS: Record<string, string> = {
    standard_us: '🇺🇸',
    standard_uk: '🇬🇧',
    standard_in: '🇮🇳',
    custom: '⚙️',
  };

  const getEditionName = (editionId: string) => {
    switch (editionId) {
      case 'standard_us': return 'Standard US Edition';
      case 'standard_uk': return 'Standard UK Edition';
      case 'standard_in': return 'India Edition';
      default: return 'Custom Edition';
    }
  };

  const renderSession = useCallback(({ item, index }: { item: SessionSummary, index: number }) => {
    // Treat any missing status or 'active' explicitly as active.
    const isEnded = item.status === 'ended';
    const isArchived = item.status === 'archived';
    
    return (
      <AnimatedPressable
        style={[
          styles.sessionCard, 
          index > 0 && styles.sessionCardArchived,
          isEnded && { borderStyle: 'dotted' }
        ]}
        onPress={() => handleSessionRestore(item)}
      >
        <View style={styles.sessionCardHeader}>
          <View style={styles.sessionCardTitleBox}>
            <Text style={styles.sessionCardTitle}>{getEditionName(item.edition)}</Text>
            <Text style={styles.sessionCardMeta}>
              {isEnded ? 'Ended ' : 'Last played '}{formatDate(item.updatedAt)}
            </Text>
          </View>
          <View style={styles.sessionHeaderRight}>
            <View style={styles.sessionIconBox}>
              <Text style={styles.sessionIcon}>{EDITION_FLAGS[item.edition] ?? '🎲'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sessionCardFooter}>
          <View style={styles.playerCountBadge}>
            <Text style={styles.playerCountText}>{item.playerNames.length} PLAYERS</Text>
          </View>
          <View style={styles.footerActions}>
            <AnimatedPressable
              style={styles.deleteBtn}
              onPress={() => {
                setSessionToDelete(item.id);
              }}
            >
              <Text style={styles.deleteBtnText}>REMOVE</Text>
            </AnimatedPressable>
            <FloatingView style={styles.resumeBtn} amplitude={isEnded ? 0 : 2} duration={2000}>
              <Text style={styles.resumeBtnText}>{isEnded ? 'VIEW STATS' : 'RESUME'}</Text>
            </FloatingView>
          </View>
        </View>
      </AnimatedPressable>
    );
  }, [handleSessionRestore, setSessionToDelete]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.cream} />
      
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: titleOpacity, transform: [{ translateY: titleY }] }]}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logoImage} resizeMode="contain" />
        <Text style={styles.subtitle}>Property Trading Ledger</Text>
      </Animated.View>

      <View style={styles.container}>
        <FlatList
          data={sessionHistory.slice(0, 5)}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>ACTIVE SESSIONS</Text>
              <Text style={styles.sectionMeta}>RESUME PLAY</Text>
            </View>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptySessionContainer}>
              <Text style={styles.emptySessionText}>No active sessions found. Start a new game below!</Text>
            </View>
          )}
          renderItem={renderSession}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          contentContainerStyle={{ paddingBottom: 16 }}
        />

        <View style={styles.bottomSection}>
          {/* Join Multiplayer */}
          <View style={styles.joinContainer}>
            <Text style={styles.joinLabel}>RESTORE SESSION</Text>
            <View style={styles.joinInputRow}>
              <TextInput
                style={styles.joinInput}
                placeholder="ENTER CODE"
                placeholderTextColor="rgba(0,0,0,0.2)"
                value={codeInput}
                onChangeText={setCodeInput}
                maxLength={6}
                autoCapitalize="characters"
              />
              <AnimatedPressable style={styles.joinBtn} onPress={handleRestoreCode}>
                <Text style={styles.joinBtnText}>→</Text>
              </AnimatedPressable>
            </View>
            {restoreError ? <Text style={styles.errorText}>{restoreError}</Text> : null}
          </View>

          {/* New Game */}
          <FloatingView amplitude={4} duration={1800}>
            <AnimatedPressable style={styles.newGameBtn} onPress={handleNewGame}>
              <Text style={styles.newGameText}>NEW GAME</Text>
            </AnimatedPressable>
          </FloatingView>

          {/* Credits */}
          <View style={styles.creditContainer}>
            <Text style={styles.creditText}>BUILT BY PRATHMESH DESHKAR</Text>
          </View>
        </View>
      </View>
      <Modal visible={!!sessionToDelete} transparent animationType="fade" onRequestClose={() => setSessionToDelete(null)}>
        <View style={styles.dialogBackdrop}>
          <View style={styles.dialogCard}>
            <Text style={styles.dialogTitle}>DELETE SESSION?</Text>
            <Text style={styles.dialogMessage}>This will permanently delete this session from your history.</Text>
            <View style={styles.dialogButtons}>
              <AnimatedPressable
                containerStyle={{ flex: 1 }}
                style={styles.dialogBtnCancel}
                onPress={() => setSessionToDelete(null)}
              >
                <Text style={styles.dialogBtnCancelText}>KEEP</Text>
              </AnimatedPressable>
              <AnimatedPressable
                containerStyle={{ flex: 1 }}
                style={styles.dialogBtnConfirm}
                onPress={() => {
                  if (sessionToDelete) deleteSession(sessionToDelete);
                  setSessionToDelete(null);
                }}
              >
                <Text style={styles.dialogBtnConfirmText}>DELETE</Text>
              </AnimatedPressable>
            </View>
          </View>
        </View>
      </Modal>

      <BrutalLoader visible={isConnecting} message="CONNECTING..." />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.cream,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 8 : 0,
  },
  header: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    zIndex: 20,
  },
  logoImage: {
    width: '100%',
    height: 240,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    fontFamily: Typography.bodySemibold,
    textTransform: 'uppercase',
    letterSpacing: 4,
    color: 'rgba(0,0,0,0.4)',
    marginTop: 12,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: Typography.display,
    color: 'rgba(0,0,0,0.6)',
    letterSpacing: 1,
  },
  sectionMeta: {
    fontSize: 10,
    fontFamily: Typography.bodySemibold,
    color: 'rgba(0,0,0,0.3)',
    letterSpacing: 2,
  },
  emptySessionContainer: {
    padding: 24,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySessionText: {
    fontFamily: Typography.bodySemibold,
    fontSize: 14,
    color: 'rgba(0,0,0,0.4)',
    textAlign: 'center',
  },
  sessionCard: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.ink,
    padding: 20,
    ...Shadows.card,
  },
  sessionCardArchived: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderStyle: 'dashed',
    opacity: 0.8,
    elevation: 0,
    shadowOpacity: 0,
  },
  sessionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sessionCardTitleBox: {
    flex: 1,
  },
  sessionCardTitle: {
    fontSize: 24,
    fontFamily: Typography.bodySemibold,
    fontStyle: 'italic',
    color: Colors.ink,
    lineHeight: 28,
  },
  sessionCardMeta: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.5)',
    fontStyle: 'italic',
    marginTop: 2,
  },
  sessionHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  deleteBtn: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    fontSize: 14,
    color: Colors.errorRed,
    fontFamily: Typography.bodySemibold,
    letterSpacing: 1,
  },
  sessionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionIcon: {
    fontSize: 18,
  },
  sessionCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerCountBadge: {
    backgroundColor: Colors.cream,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.ink,
  },
  playerCountText: {
    fontFamily: Typography.bodySemibold,
    fontSize: 12,
    color: Colors.ink,
    letterSpacing: 1,
  },
  resumeBtn: {
    backgroundColor: Colors.ink,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: Colors.ink,
    ...Shadows.btn,
    shadowColor: Colors.ink,
  },
  resumeBtnText: {
    color: Colors.white,
    fontFamily: Typography.display,
    fontSize: 14,
    letterSpacing: 2,
  },
  bottomSection: {
    paddingTop: 16,
    paddingBottom: 40,
    gap: 24,
  },
  joinContainer: {
    position: 'relative',
    marginTop: 12,
  },
  joinLabel: {
    position: 'absolute',
    top: -10,
    left: 16,
    backgroundColor: Colors.cream,
    paddingHorizontal: 8,
    fontSize: 10,
    fontFamily: Typography.bodySemibold,
    color: 'rgba(0,0,0,0.4)',
    letterSpacing: 2,
    zIndex: 10,
  },
  joinInputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  joinInput: {
    flex: 1,
    height: 56,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.ink,
    paddingHorizontal: 16,
    fontFamily: Typography.display,
    fontSize: 18,
    letterSpacing: 2,
    color: Colors.ink,
    // inner shadow emulation not perfect in RN, but padding gives it space
  },
  joinBtn: {
    width: 56,
    height: 56,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.btn,
  },
  joinBtnText: {
    fontSize: 24,
    color: Colors.ink,
  },
  errorText: {
    color: Colors.errorRed,
    fontFamily: Typography.bodySemibold,
    fontSize: 12,
    marginTop: 8,
    marginLeft: 4,
  },
  creditContainer: {
    alignItems: 'center',
    marginTop: -8,
  },
  creditText: {
    fontFamily: Typography.display,
    fontSize: 12,
    color: 'rgba(0,0,0,0.3)',
    letterSpacing: 2,
  },
  newGameBtn: {
    width: '100%',
    height: 64,
    backgroundColor: Colors.gold,
    borderWidth: 2,
    borderColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.btn,
  },
  newGameText: {
    color: Colors.white,
    fontFamily: Typography.display,
    fontSize: 24,
    letterSpacing: 4,
  },
  dialogBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialogCard: {
    backgroundColor: Colors.white,
    borderWidth: 4,
    borderColor: Colors.ink,
    padding: 24,
    width: '100%',
    ...Shadows.card,
  },
  dialogTitle: {
    fontSize: 32,
    fontFamily: Typography.display,
    color: Colors.ink,
    marginBottom: 8,
  },
  dialogMessage: {
    fontSize: 16,
    fontFamily: Typography.bodySemibold,
    color: 'rgba(0,0,0,0.6)',
    marginBottom: 32,
  },
  dialogButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  dialogBtnCancel: {
    width: '100%',
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.ink,
    paddingVertical: 16,
    alignItems: 'center',
    ...Shadows.btn,
  },
  dialogBtnCancelText: {
    fontSize: 16,
    fontFamily: Typography.display,
    color: Colors.ink,
  },
  dialogBtnConfirm: {
    width: '100%',
    backgroundColor: Colors.errorRed,
    borderWidth: 2,
    borderColor: Colors.ink,
    paddingVertical: 16,
    alignItems: 'center',
    ...Shadows.btn,
  },
  dialogBtnConfirmText: {
    fontSize: 16,
    fontFamily: Typography.display,
    color: Colors.white,
  },
});
