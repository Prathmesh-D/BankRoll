import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Modal,
  Image,
  Platform,
  Alert,
  BackHandler,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  LinearTransition,
  SharedValue,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { Springs } from '../theme/animations';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useGameStore } from '../store/useGameStore';
import { useCalculatorStore } from '../store/useCalculatorStore';
import { Colors, Typography, Spacing, Radius, ComponentSizes, Shadows } from '../theme/tokens';
import PlayerCard from '../components/PlayerCard';
import SessionCodeBadge from '../components/SessionCodeBadge';
import PropertyPicker from '../components/PropertyPicker';
import { isMortgaged } from '../domain/propertyUtils';
import type { Property } from '../types/edition';
import QuickPaySheet from '../components/QuickPaySheet';
import { AnimatedPressable } from '../components/AnimatedPressable';
import TransactionLog from '../components/TransactionLog';
import HouseRulesPanel from '../components/HouseRulesPanel';
import type { Entity } from '../types/entity';
import { formatBalance } from '../domain/currencyFormatter';
import { playSound } from '../utils/SoundManager';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

interface DraggableCardProps {
  entity: Entity;
  onDragStart?: (entity: Entity) => void;
  onDragUpdate?: (entity: Entity, x: number, y: number) => void;
  onDragEnd?: (entity: Entity) => void;
  children: React.ReactNode;
  style?: object;
  cursorX: SharedValue<number>;
  cursorY: SharedValue<number>;
  isDragging: SharedValue<boolean>;
}

function DraggableCard({ 
  entity, 
  onDragStart, 
  onDragUpdate,
  onDragEnd, 
  children, 
  style,
  cursorX,
  cursorY,
  isDragging,
}: DraggableCardProps) {
  const scale = useSharedValue(1);

  const panGesture = Gesture.Pan()
    .onBegin((event) => {
      scale.value = withSpring(1.05, Springs.snappy);
      isDragging.value = true;
      cursorX.value = event.absoluteX;
      cursorY.value = event.absoluteY;
      if (onDragStart) runOnJS(onDragStart)(entity);
    })
    .onUpdate((event) => {
      cursorX.value = event.absoluteX;
      cursorY.value = event.absoluteY;
      if (onDragUpdate) runOnJS(onDragUpdate)(entity, event.absoluteX, event.absoluteY);
    })
    .onEnd((event) => {
      scale.value = withSpring(1.0, Springs.gentle);
      isDragging.value = false;
      cursorX.value = -1000;
      cursorY.value = -1000;
      if (onDragEnd) runOnJS(onDragEnd)(entity);
    })
    .onFinalize(() => {
      scale.value = withSpring(1.0, Springs.gentle);
      isDragging.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[style, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

export default function Dashboard() {
  const navigation = useNavigation<Nav>();
  const { session, executeTransaction, undoTransaction, updateEntity, bankruptEntity } = useGameStore();
  const { toggle: toggleCalc } = useCalculatorStore();

  const [mortgageTargetId, setMortgageTargetId] = useState<string | null>(null);
  const mortgageTarget = mortgageTargetId ? session?.entities.find(e => e.id === mortgageTargetId) || null : null;
  const prevMortgageTargetRef = useRef<Entity | null>(null);
  React.useEffect(() => {
    if (mortgageTarget) {
      prevMortgageTargetRef.current = mortgageTarget;
    }
  }, [mortgageTarget]);
  const displayMortgageTarget = mortgageTarget || prevMortgageTargetRef.current;
  const [selectedMortgages, setSelectedMortgages] = useState<Property[]>([]);
  const [mortgageDialog, setMortgageDialog] = useState<{ properties: Property[]; isMortgaged: boolean } | null>(null);
  const [bankruptDialog, setBankruptDialog] = useState<Entity | null>(null);
  const [fundsRequiredMessage, setFundsRequiredMessage] = useState<string | null>(null);
  const [payFrom, setPayFrom] = useState<Entity | null>(null);
  const [payTo, setPayTo] = useState<Entity | null>(null);
  const [showTransactionLog, setShowTransactionLog] = useState(false);
  const [showHouseRules, setShowHouseRules] = useState(false);
  const [showEndGameModal, setShowEndGameModal] = useState(false);
  const [showLeaveGameDialog, setShowLeaveGameDialog] = useState(false);

  const viewRefs = useRef<Record<string, View | null>>({});
  const dropZones = useRef<Record<string, {x: number, y: number, w: number, h: number}>>({});
  const [hoveredTargetId, setHoveredTargetId] = useState<string | null>(null);
  
  const cursorX = useSharedValue(-1000);
  const cursorY = useSharedValue(-1000);
  const isDragging = useSharedValue(false);

  React.useEffect(() => {
    const onBackPress = () => {
      setShowLeaveGameDialog(true);
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [navigation]);

  const entities = React.useMemo(() => session?.entities || [], [session?.entities]);
  const editionConfig = session?.editionConfig;
  const houseRules = session?.houseRules;
  const transactions = session?.transactions || [];

  const players = React.useMemo(() => entities.filter(e => e.type === 'player'), [entities]);
  const bank = React.useMemo(() => entities.find(e => e.type === 'bank'), [entities]);

  const measureTargets = useCallback(() => {
    Object.keys(viewRefs.current).forEach(id => {
      const targetEntity = entities.find(e => e.id === id);
      if (targetEntity && !targetEntity.isActive) {
        delete dropZones.current[id];
        return;
      }
      const view = viewRefs.current[id];
      if (view) {
        view.measure((x, y, w, h, px, py) => {
          // Mutating a standard ref is instantly synchronous and has no race conditions
          dropZones.current[id] = { x: px, y: py, w, h };
        });
      }
    });
  }, [entities]);

  const handleDragStart = useCallback((entity: Entity) => {
    playSound('whoosh');
    measureTargets();
    setPayFrom(entity);
    setHoveredTargetId(null);
  }, [measureTargets]);

  const handleDragUpdate = useCallback((entity: Entity, x: number, y: number) => {
    let hitId: string | null = null;
    const zones = dropZones.current;
    
    // Add a 20px buffer to make hit detection more generous
    const buffer = 20;

    for (const id in zones) {
      if (id === entity.id) continue;
      const z = zones[id];
      if (
        x >= z.x - buffer && x <= z.x + z.w + buffer &&
        y >= z.y - buffer && y <= z.y + z.h + buffer
      ) {
        hitId = id;
        break;
      }
    }
    
    setHoveredTargetId(prev => {
      if (prev !== hitId) {
        return hitId;
      }
      return prev;
    });
  }, []);

  const handleDragEnd = useCallback((_entity: Entity) => {
    setHoveredTargetId(prevHit => {
      if (prevHit) {
        const targetEntity = entities.find(e => e.id === prevHit);
        if (targetEntity) {
          setPayTo(targetEntity);
        }
      } else {
        setPayFrom(null);
      }
      return null;
    });
  }, [entities]);

  const handleMortgageTarget = useCallback((entity: Entity) => {
    setMortgageTargetId(entity.id);
  }, []);

  const handleSalary = useCallback((entity: Entity) => {
    if (!editionConfig) return;
    const bankEntity = entities.find(e => e.type === 'bank');
    if (!bankEntity) return;
    const txId = executeTransaction({
      fromEntityId: bankEntity.id,
      toEntityId: entity.id,
      amount: editionConfig.salary,
      type: 'SALARY',
      label: `Salary · ${entity.name}`,
    });
  }, [entities, editionConfig, executeTransaction]);

  const handlePropertySelect = useCallback((property: Property) => {
    if (!mortgageTarget) return;
    
    setSelectedMortgages(prev => {
      const isSelected = prev.some(p => p.id === property.id);
      if (isSelected) {
        return prev.filter(p => p.id !== property.id);
      } else {
        const isM = isMortgaged(property.id, mortgageTarget);
        const hasMortgagedSelected = prev.some(p => isMortgaged(p.id, mortgageTarget));
        const hasUnmortgagedSelected = prev.some(p => !isMortgaged(p.id, mortgageTarget));
        
        if (prev.length > 0) {
          if ((isM && hasUnmortgagedSelected) || (!isM && hasMortgagedSelected)) {
            Alert.alert('Cannot Mix', 'You cannot mortgage and pay off properties at the same time. Please finish your current selection first.');
            return prev;
          }
        }
        return [...prev, property];
      }
    });
  }, [mortgageTarget]);

  const handleDoubleTapBalance = useCallback(() => {}, []);

  const handlePay = useCallback((amount: number, label?: string, propertyId?: string) => {
    if (!payFrom || !payTo) return;
    
    const minLimit = houseRules?.allowNegative100 ? -100 : 0;
    if (payFrom.type !== 'bank' && payFrom.balance - amount < minLimit) {
      setFundsRequiredMessage(`You cannot go below ${minLimit}. Please mortgage properties to raise funds first.`);
      setPayFrom(null);
      setPayTo(null);
      return;
    }

    const txId = executeTransaction({
      fromEntityId: payFrom.id,
      toEntityId: payTo.id,
      amount,
      type: label?.includes('Rent') ? 'RENT' : 'TRANSFER',
      label,
      propertyId,
    });
    setPayFrom(null);
    setPayTo(null);
  }, [payFrom, payTo, houseRules?.allowNegative100, executeTransaction]);

  const handleEndGame = useCallback(() => {
    setShowEndGameModal(true);
  }, []);

  const cursorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: cursorX.value - 24 },
        { translateY: cursorY.value - 24 },
        { scale: isDragging.value ? withSpring(1) : withSpring(0) },
      ],
      opacity: isDragging.value ? 1 : 0,
    };
  }, [cursorX, cursorY, isDragging]);

  if (!session || !editionConfig || !bank) {
    return (
      <View style={styles.noSession}>
        <Text style={styles.noSessionText}>No active game</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.noSessionLink}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.maroon} />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>BankRoll</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => setShowTransactionLog(true)} style={styles.logButton}>
            <Text style={styles.logButtonText}>Log</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.specialEntities}>
        <View
          ref={ref => { viewRefs.current[bank.id] = ref; }}
          style={styles.bankCardWrapper}
        >
          <DraggableCard
            entity={bank}
            onDragStart={handleDragStart}
            onDragUpdate={handleDragUpdate}
            onDragEnd={handleDragEnd}
            style={styles.bankCard}
            cursorX={cursorX}
            cursorY={cursorY}
            isDragging={isDragging}
          >
            <View style={styles.bankAccent} />
            <View style={styles.bankContent}>
              <Text style={styles.bankLabel}>BANK</Text>
              <Text style={[styles.bankBalance, houseRules?.infiniteBankMoney && styles.bankBalanceInfinite]}>
                {houseRules?.infiniteBankMoney ? '∞' : formatBalance(bank.balance, editionConfig.currency)}
              </Text>
            </View>
          </DraggableCard>
          {hoveredTargetId === bank.id && <View style={styles.dropHalo} pointerEvents="none" />}
        </View>

      </View>

      <ScrollView
        contentContainerStyle={styles.playerGrid}
        showsVerticalScrollIndicator={false}
        scrollEnabled={payFrom === null}
      >
        {players.map((player) => (
          <View
            key={player.id}
            ref={ref => { viewRefs.current[player.id] = ref; }}
            style={styles.playerWrapper}
          >
            <PlayerCard
              entity={player}
              currency={editionConfig.currency}
              onSalaryPress={handleSalary}
              onMortgagePress={handleMortgageTarget}
              onDragStart={handleDragStart}
              onDragUpdate={handleDragUpdate}
              onDragEnd={handleDragEnd}
              onDoubleTapBalance={handleDoubleTapBalance}
              cursorX={cursorX}
              cursorY={cursorY}
              isDragging={isDragging}
            />
            {hoveredTargetId === player.id && <View style={styles.dropHalo} pointerEvents="none" />}
          </View>
        ))}
      </ScrollView>

      <Animated.View style={[styles.targetCursor, cursorStyle]} pointerEvents="none">
        <View style={styles.targetCursorInner} />
      </Animated.View>

      <View style={styles.bottomLeftControls}>
        <SessionCodeBadge code={session.sessionCode} />
        <TouchableOpacity style={styles.endBtn} onPress={handleEndGame} activeOpacity={0.85}>
          <Text style={styles.endBtnText}>End Game</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.fab} onPress={toggleCalc} activeOpacity={0.85}>
        <Image source={require('../../assets/images/logo.png')} style={styles.fabLogoImage} />
      </TouchableOpacity>

      <Modal 
        visible={!!mortgageTargetId} 
        animationType="slide" 
        onRequestClose={() => {
          setMortgageTargetId(null);
          setSelectedMortgages([]);
        }}
      >
        {displayMortgageTarget && (
          <SafeAreaView style={styles.modalSafe}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={1}>
                {displayMortgageTarget.name}'s Properties
              </Text>
              <TouchableOpacity onPress={() => setMortgageTargetId(null)}>
                <Text style={styles.modalCloseIcon}>X</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.bankruptContainer}>
              <TouchableOpacity
                onLongPress={() => setBankruptDialog(displayMortgageTarget)}
                delayLongPress={1000}
                style={styles.bankruptBtn}
              >
                <Text style={styles.bankruptBtnText}>HOLD TO BANKRUPT</Text>
              </TouchableOpacity>
            </View>
            
            {displayMortgageTarget.mortgagedProperties.length > 0 && (
              <View style={styles.mortgagedListContainer}>
                <Text style={styles.mortgagedListTitle}>MORTGAGED PROPERTIES</Text>
                <Animated.ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {displayMortgageTarget.mortgagedProperties.map(propId => {
                    const prop = editionConfig.properties.find(p => p.id === propId);
                    if (!prop) return null;
                    return (
                      <Animated.View key={prop.id} layout={LinearTransition} style={[styles.mortgagedPropCard, { backgroundColor: prop.colorHex || Colors.white }]}>
                        <Text style={[styles.mortgagedPropName, { fontFamily: Typography.display, textTransform: 'uppercase' }]} numberOfLines={2}>{prop.name}</Text>
                        <TouchableOpacity 
                          style={styles.payOffBtn}
                          onPress={() => setMortgageDialog({ properties: [prop], isMortgaged: true })}
                        >
                          <Text style={styles.payOffBtnText}>PAY OFF · {formatBalance(prop.unmortgageCost, editionConfig.currency)}</Text>
                        </TouchableOpacity>
                      </Animated.View>
                    );
                  })}
                </Animated.ScrollView>
              </View>
            )}

            <PropertyPicker
              editionConfig={editionConfig}
              mortgagedByEntity={displayMortgageTarget}
              allEntities={entities}
              selectedPropertyIds={selectedMortgages.map(p => p.id)}
              hideHeader={true}
              onSelect={handlePropertySelect}
              onClose={() => {
                setMortgageTargetId(null);
                setSelectedMortgages([]);
              }}
            />
            
            {selectedMortgages.length > 0 && (
              <View style={styles.mortgageFloatingAction}>
                <AnimatedPressable
                  style={styles.confirmSelectionBtn}
                  onPress={() => {
                    const isM = isMortgaged(selectedMortgages[0].id, displayMortgageTarget);
                    setMortgageDialog({ properties: selectedMortgages, isMortgaged: isM });
                  }}
                >
                  <Text style={styles.confirmSelectionText}>
                    CONFIRM {selectedMortgages.length} SELECTION{selectedMortgages.length > 1 ? 'S' : ''} (
                    {formatBalance(
                      selectedMortgages.reduce((sum, p) => sum + (isMortgaged(p.id, mortgageTarget) ? p.unmortgageCost : p.mortgageValue), 0),
                      editionConfig.currency
                    )})
                  </Text>
                </AnimatedPressable>
              </View>
            )}
          </SafeAreaView>
        )}
      </Modal>

      <Modal visible={!!bankruptDialog} transparent animationType="fade" onRequestClose={() => setBankruptDialog(null)}>
        {bankruptDialog && (
          <View style={styles.dialogBackdrop}>
            <View style={styles.dialogCard}>
              <Text style={styles.dialogTitle}>DECLARE BANKRUPTCY?</Text>
              <Text style={styles.dialogMessage}>
                Are you sure you want to bankrupt {bankruptDialog.name}? This will clear all their mortgaged properties.
              </Text>
              <View style={styles.dialogButtons}>
                <AnimatedPressable
                  containerStyle={styles.flex1}
                  style={styles.dialogBtnCancel}
                  onPress={() => setBankruptDialog(null)}
                >
                  <Text style={styles.dialogBtnCancelText}>CANCEL</Text>
                </AnimatedPressable>
                <AnimatedPressable
                  containerStyle={styles.flex1}
                  style={styles.dialogBtnConfirm}
                  onPress={() => {
                    // Use bankruptEntity() to properly transfer balance to bank
                    bankruptEntity(bankruptDialog.id);
                    setBankruptDialog(null);
                    setMortgageTargetId(null);
                    setSelectedMortgages([]);
                  }}
                >
                  <Text style={styles.dialogBtnConfirmText}>BANKRUPT</Text>
                </AnimatedPressable>
              </View>
            </View>
          </View>
        )}
      </Modal>

      <Modal visible={!!mortgageDialog} transparent animationType="fade" onRequestClose={() => setMortgageDialog(null)}>
        {mortgageDialog && displayMortgageTarget && (
          <View style={styles.dialogBackdrop}>
            <View style={styles.dialogCard}>
              <Text style={styles.dialogTitle}>
                {mortgageDialog.isMortgaged ? 'PAY OFF MORTGAGE?' : 'MORTGAGE PROPERTY?'}
              </Text>
              <Text style={styles.dialogMessage}>
                {mortgageDialog.isMortgaged 
                  ? `Pay ${formatBalance(mortgageDialog.properties.reduce((acc, p) => acc + p.unmortgageCost, 0), editionConfig.currency)} to the Bank to unmortgage ${mortgageDialog.properties.length} propert${mortgageDialog.properties.length > 1 ? 'ies' : 'y'}?`
                  : `Mortgage ${mortgageDialog.properties.length} propert${mortgageDialog.properties.length > 1 ? 'ies' : 'y'}? You will receive ${formatBalance(mortgageDialog.properties.reduce((acc, p) => acc + p.mortgageValue, 0), editionConfig.currency)} from the Bank.`}
              </Text>
              <View style={styles.dialogButtons}>
                <AnimatedPressable
                  containerStyle={styles.flex1}
                  style={styles.dialogBtnCancel}
                  onPress={() => setMortgageDialog(null)}
                >
                  <Text style={styles.dialogBtnCancelText}>CANCEL</Text>
                </AnimatedPressable>
                <AnimatedPressable
                  containerStyle={styles.flex1}
                  style={styles.dialogBtnConfirm}
                  onPress={() => {
                    const bankEntity = entities.find(e => e.type === 'bank')!;
                    
                    if (mortgageDialog.isMortgaged) {
                      const totalCost = mortgageDialog.properties.reduce((acc, p) => acc + p.unmortgageCost, 0);
                      const minLimit = houseRules?.allowNegative100 ? -100 : 0;
                      if (displayMortgageTarget.type !== 'bank') {
                        if (displayMortgageTarget.balance - totalCost < minLimit) {
                          setFundsRequiredMessage(`You cannot go below ${minLimit}. Please mortgage other properties to raise funds first.`);
                          setMortgageDialog(null);
                          return;
                        }
                      }
                    }

                    mortgageDialog.properties.forEach(prop => {
                      if (mortgageDialog.isMortgaged) {
                        executeTransaction({
                          fromEntityId: displayMortgageTarget.id,
                          toEntityId: bankEntity.id,
                          amount: prop.unmortgageCost,
                          type: 'MORTGAGE_REPAY',
                          label: `Unmortgage ${prop.name}`,
                          propertyId: prop.id,
                        }, { skipDebounce: true });
                      } else {
                        executeTransaction({
                          fromEntityId: bankEntity.id,
                          toEntityId: displayMortgageTarget.id,
                          amount: prop.mortgageValue,
                          type: 'MORTGAGE',
                          label: `Mortgage ${prop.name}`,
                          propertyId: prop.id,
                        }, { skipDebounce: true });
                      }
                    });
                    if (mortgageDialog.isMortgaged) {
                      playSound('whoosh');
                    }
                    setMortgageDialog(null);
                    setSelectedMortgages([]);
                  }}
                >
                  <Text style={styles.dialogBtnConfirmText}>
                    {mortgageDialog.isMortgaged ? 'PAY OFF' : 'MORTGAGE'}
                  </Text>
                </AnimatedPressable>
              </View>
            </View>
          </View>
        )}
      </Modal>

      {payFrom && payTo && (
        <QuickPaySheet
          visible={!!(payFrom && payTo)}
          fromEntity={payFrom}
          toEntity={payTo}
          editionConfig={editionConfig}
          prefilledAmount={useCalculatorStore.getState().prefilledAmount || undefined}
          onPay={(amount, label, propId) => {
            handlePay(amount, label, propId);
            useCalculatorStore.setState({ prefilledAmount: null });
          }}
          onClose={() => { 
            setPayFrom(null); 
            setPayTo(null); 
            useCalculatorStore.setState({ prefilledAmount: null });
          }}
        />
      )}

      <Modal
        visible={showTransactionLog}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowTransactionLog(false)}
      >
        {showTransactionLog && (
          <TransactionLog
            transactions={transactions}
            entities={entities}
            currency={editionConfig.currency}
            undoStack={session?.undoStack ?? []}
            onUndo={(txId) => {
              undoTransaction(txId);
            }}
            onClose={() => setShowTransactionLog(false)}
          />
        )}
      </Modal>

      <Modal
        visible={showHouseRules}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowHouseRules(false)}
      >
        {showHouseRules && <HouseRulesPanel onClose={() => setShowHouseRules(false)} />}
      </Modal>

      <Modal visible={showEndGameModal} transparent animationType="fade" onRequestClose={() => setShowEndGameModal(false)}>
        <View style={styles.dialogBackdrop}>
          <View style={styles.dialogCard}>
            <Text style={styles.dialogTitle}>END GAME?</Text>
            <Text style={styles.dialogMessage}>This will finalise the ledger and archive the current session.</Text>
            <View style={styles.dialogButtons}>
              <AnimatedPressable
                containerStyle={styles.flex1}
                style={styles.dialogBtnCancel}
                onPress={() => setShowEndGameModal(false)}
              >
                <Text style={styles.dialogBtnCancelText}>KEEP PLAYING</Text>
              </AnimatedPressable>
              <AnimatedPressable
                containerStyle={styles.flex1}
                style={styles.dialogBtnConfirm}
                onPress={() => {
                  setShowEndGameModal(false);
                  navigation.navigate('GameSummary', { isEnding: true });
                }}
              >
                <Text style={styles.dialogBtnConfirmText}>END GAME</Text>
              </AnimatedPressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showLeaveGameDialog} transparent animationType="fade" onRequestClose={() => setShowLeaveGameDialog(false)}>
        <View style={styles.dialogBackdrop}>
          <View style={styles.dialogCard}>
            <Text style={styles.dialogTitle}>LEAVE GAME?</Text>
            <Text style={styles.dialogMessage}>Do you want to return to the home menu? Your session will be saved automatically.</Text>
            <View style={styles.dialogButtons}>
              <AnimatedPressable
                containerStyle={styles.flex1}
                style={styles.dialogBtnCancel}
                onPress={() => setShowLeaveGameDialog(false)}
              >
                <Text style={styles.dialogBtnCancelText}>STAY</Text>
              </AnimatedPressable>
              <AnimatedPressable
                containerStyle={styles.flex1}
                style={styles.dialogBtnConfirm}
                onPress={() => {
                  setShowLeaveGameDialog(false);
                  navigation.navigate('Home');
                }}
              >
                <Text style={styles.dialogBtnConfirmText}>LEAVE</Text>
              </AnimatedPressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={!!fundsRequiredMessage} transparent animationType="fade" onRequestClose={() => setFundsRequiredMessage(null)}>
        {fundsRequiredMessage && (
          <View style={styles.dialogBackdrop}>
            <View style={styles.dialogCard}>
              <Text style={styles.dialogTitle}>FUNDS REQUIRED</Text>
              <Text style={styles.dialogMessage}>{fundsRequiredMessage}</Text>
              <View style={styles.dialogButtons}>
                <AnimatedPressable
                  containerStyle={styles.flex1}
                  style={styles.dialogBtnConfirm}
                  onPress={() => setFundsRequiredMessage(null)}
                >
                  <Text style={styles.dialogBtnConfirmText}>OK</Text>
                </AnimatedPressable>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.cream,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  noSession: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cream,
    gap: Spacing.md,
  },
  noSessionText: {
    fontSize: Typography.size.h1,
    fontFamily: Typography.display,
    color: Colors.ink,
  },
  noSessionLink: {
    fontSize: Typography.size.body,
    color: Colors.gold,
    fontFamily: Typography.bodySemibold,
    borderWidth: 2,
    borderColor: Colors.ink,
    paddingHorizontal: 16,
    paddingVertical: 8,
    ...Shadows.btn,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.cream,
    borderBottomWidth: 4,
    borderBottomColor: Colors.ink,
    minHeight: 60,
  },
  headerLeft: {},
  headerTitle: {
    fontSize: Typography.size.display,
    fontFamily: Typography.display,
    color: Colors.ink,
    letterSpacing: 1,
  },
  headerEdition: {
    fontSize: Typography.size.micro,
    fontFamily: Typography.bodySemibold,
    color: 'rgba(0,0,0,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexShrink: 1,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  logButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.ink,
    ...Shadows.btn,
  },
  logButtonText: { 
    fontSize: Typography.size.micro,
    fontFamily: Typography.bodySemibold,
    color: Colors.ink,
    textTransform: 'uppercase',
  },
  settingsButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.ink,
    ...Shadows.btn,
  },
  settingsText: { 
    fontSize: Typography.size.micro,
    fontFamily: Typography.bodySemibold,
    color: Colors.ink,
    textTransform: 'uppercase',
  },
  specialEntities: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.cream,
    gap: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  bankCardWrapper: {
    flex: 1,
    position: 'relative',
  },
  bankCard: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.ink,
    ...Shadows.card,
  },
  bankAccent: {
    height: 10,
    width: '100%',
    backgroundColor: Colors.ink,
    borderBottomWidth: 2,
    borderBottomColor: Colors.ink,
  },
  bankContent: {
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  parkingCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.ink,
    ...Shadows.card,
  },
  bankLabel: {
    fontSize: Typography.size.caption,
    fontFamily: Typography.display,
    color: 'rgba(0,0,0,0.4)',
    letterSpacing: 2,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
  },
  bankBalance: {
    fontSize: 40,
    fontFamily: Typography.display,
    color: Colors.ink,
    letterSpacing: 1,
  },
  bankBalanceInfinite: {
    fontSize: 80,
    lineHeight: 80,
    paddingBottom: 16,
  },
  playerGrid: {
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: Spacing.xl * 2,
  },
  playerWrapper: {
    width: '47%',
    marginBottom: Spacing.lg,
    position: 'relative',
  },
  dropHalo: {
    ...StyleSheet.absoluteFill as object,
    borderWidth: 4,
    borderColor: Colors.gold,
    backgroundColor: Colors.gold + '1A',
    zIndex: 10,
    margin: -6, // expand slightly outside the card bounds
    ...Shadows.card,
    shadowColor: Colors.gold,
  },
  targetCursor: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.gold + '44',
    borderWidth: 2,
    borderColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    elevation: 99,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  targetCursorInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.gold,
  },
  fabLogoImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  bottomLeftControls: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    zIndex: 50,
  },
  endBtn: {
    backgroundColor: Colors.errorRed,
    borderWidth: 2,
    borderColor: Colors.ink,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...Shadows.btn,
  },
  endBtnText: {
    fontSize: 16,
    fontFamily: Typography.display,
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 2,
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
  modalSafe: { flex: 1, backgroundColor: Colors.parchment, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  modalHeader: { padding: 16, borderBottomWidth: 2, borderBottomColor: Colors.ink, backgroundColor: Colors.white, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontFamily: Typography.display, fontSize: 24, color: Colors.ink, letterSpacing: 1, flex: 1 },
  modalCloseIcon: { fontFamily: Typography.display, fontSize: 24, color: Colors.errorRed },
  bankruptContainer: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.parchment, borderBottomWidth: 2, borderBottomColor: Colors.ink, alignItems: 'center' },
  bankruptBtn: { paddingHorizontal: 24, paddingVertical: 12, backgroundColor: Colors.errorRed, borderWidth: 2, borderColor: Colors.ink, shadowColor: Colors.ink, shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4 },
  bankruptBtnText: { fontFamily: Typography.display, fontSize: 14, color: Colors.white, letterSpacing: 1 },
  mortgagedListContainer: { padding: 16, borderBottomWidth: 2, borderBottomColor: Colors.ink, backgroundColor: Colors.cream },
  mortgagedListTitle: { fontFamily: Typography.display, fontSize: 16, color: Colors.ink, marginBottom: 8, letterSpacing: 1 },
  mortgagedPropCard: { marginRight: 16, width: 140, borderWidth: 2, borderColor: Colors.ink, backgroundColor: Colors.white, padding: 8 },
  mortgagedPropName: { fontFamily: Typography.bodySemibold, fontSize: 14, color: Colors.ink, marginBottom: 8, height: 40 },
  payOffBtn: { backgroundColor: Colors.cream, paddingVertical: 8, alignItems: 'center', borderWidth: 2, borderColor: Colors.ink },
  payOffBtnText: { fontFamily: Typography.display, fontSize: 12, color: Colors.ink },
  mortgageFloatingAction: { position: 'absolute', bottom: 32, left: 24, right: 24, zIndex: 100 },
  mortgageFloatingBadge: { alignItems: 'center', marginBottom: 8 },
  mortgageFloatingText: { fontFamily: Typography.display, fontSize: 16, color: Colors.ink, backgroundColor: Colors.cream, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, overflow: 'hidden', borderWidth: 2, borderColor: Colors.ink },
  flex1: {
    flex: 1,
  },
  confirmSelectionBtn: {
    backgroundColor: Colors.ink,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  confirmSelectionText: {
    fontFamily: Typography.display,
    fontSize: 16,
    color: Colors.white,
    letterSpacing: 1,
  },
});
