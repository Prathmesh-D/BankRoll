import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { SetupStackParamList } from '../../navigation/SetupNavigator';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../theme/tokens';
import { formatBalance } from '../../domain/currencyFormatter';
import { getEditionConfig } from '../../data/editions';
import { AnimatedPressable } from '../../components/AnimatedPressable';
import { FloatingView } from '../../components/FloatingView';
import { defaultHouseRules } from '../../domain/defaults';

type Nav = NativeStackNavigationProp<SetupStackParamList, 'HouseRulesSetup'>;
type Route = RouteProp<SetupStackParamList, 'HouseRulesSetup'>;

export default function HouseRulesSetup() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { edition, playerNames, playerAvatars } = route.params;

  const editionConfig = edition !== 'custom' ? getEditionConfig(edition) : null;
  const [rules, setRules] = useState({
    ...defaultHouseRules(editionConfig ?? undefined),
    startingBonus: 200,
  });
  const [startingBalance, setStartingBalance] = useState(editionConfig?.startingBalance ?? 1500);

  const symbol = editionConfig?.currency.symbol ?? '$';

  const RULE_DEFS = [
    {
      key: 'noBankruptcy' as const,
      icon: '🏛',
      label: 'No Bankruptcy',
      desc: 'Max -100 debt allowed. Mortgage properties to raise funds.',
    },
    {
      key: 'infiniteBankMoney' as const,
      icon: '🏦',
      label: 'Infinite Bank Money',
      desc: 'The Bank never runs out of cash.',
    },
  ];

  const toggleRule = (key: keyof typeof rules) => {
    setRules(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const setSalary = (amount: number) => {
    setRules(prev => ({ ...prev, startingBonus: amount }));
  };

  const adjustInitialBalance = (delta: number) => {
    setStartingBalance(prev => Math.max(0, prev + delta));
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top Bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 48 }}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={{ paddingHorizontal: 12, paddingVertical: 8, borderWidth: 2, borderColor: Colors.ink, backgroundColor: Colors.white, ...Shadows.btn }}
        >
          <Text style={{ fontFamily: Typography.display, fontSize: 14, color: Colors.ink, letterSpacing: 1 }}>BACK</Text>
        </TouchableOpacity>

        {/* Progress */}
        <View style={styles.progress}>
          <View style={[styles.progressDot, styles.progressDotDone]} />
          <View style={[styles.progressDot, styles.progressDotDone]} />
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressDot} />
        </View>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.stepLabel}>Step 3 of 4</Text>
        <Text style={styles.title}>House Rules</Text>
        <Text style={styles.subtitle}>Customise how you play. All optional.</Text>

        {/* Initial Amount */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🏦 Initial Amount</Text>
          <Text style={styles.cardDesc}>How much money does each player start with?</Text>
          <View style={styles.salaryContainer}>
            <View style={styles.salaryValueBox}>
              <Text style={styles.salaryValue}>{symbol}{startingBalance.toLocaleString()}</Text>
            </View>
            <View style={styles.salaryBtnRow}>
              <TouchableOpacity style={styles.salaryBtn} onPress={() => adjustInitialBalance(-500)}>
                <Text style={styles.salaryBtnText}>-500</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.salaryBtn} onPress={() => adjustInitialBalance(-100)}>
                <Text style={styles.salaryBtnText}>-100</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.salaryBtn, styles.salaryBtnAdd]} onPress={() => adjustInitialBalance(100)}>
                <Text style={[styles.salaryBtnText, styles.salaryBtnAddText]}>+100</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.salaryBtn, styles.salaryBtnAdd]} onPress={() => adjustInitialBalance(500)}>
                <Text style={[styles.salaryBtnText, styles.salaryBtnAddText]}>+500</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* GO Salary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💰 GO Salary</Text>
          <Text style={styles.cardDesc}>How much does each player collect when passing Go?</Text>
          <View style={styles.salaryContainer}>
            <View style={styles.salaryValueBox}>
              <Text style={styles.salaryValue}>{symbol}{rules.startingBonus.toLocaleString()}</Text>
            </View>
            <View style={styles.salaryBtnRow}>
              {[100, 200, 300, 400].map(amount => (
                <TouchableOpacity 
                  key={amount}
                  style={[
                    styles.salaryBtn, 
                    rules.startingBonus === amount && styles.salaryBtnSelected
                  ]} 
                  onPress={() => setSalary(amount)}
                >
                  <Text style={[
                    styles.salaryBtnText,
                    rules.startingBonus === amount && styles.salaryBtnTextSelected
                  ]}>{amount}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Rule Toggles */}
        {RULE_DEFS.map(def => (
          <TouchableOpacity
            key={def.key}
            style={[styles.ruleCard, rules[def.key] && styles.ruleCardActive]}
            onPress={() => toggleRule(def.key)}
            activeOpacity={0.8}
          >
            <Text style={styles.ruleIcon}>{def.icon}</Text>
            <View style={styles.ruleInfo}>
              <Text style={[styles.ruleLabel, rules[def.key] && styles.ruleLabelActive]}>
                {def.label}
              </Text>
              <Text style={styles.ruleDesc}>{def.desc}</Text>
            </View>
            <View style={[styles.checkbox, rules[def.key] && styles.checkboxActive]}>
              {rules[def.key] && <Text style={styles.checkboxText}>✔</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <FloatingView amplitude={4} duration={1800}>
          <AnimatedPressable
            style={styles.nextButton}
            onPress={() => navigation.navigate('BalanceReview', {
              edition,
              playerNames,
              playerAvatars,
              houseRules: rules as any,
              startingBalance,
            })}
          >
            <Text style={styles.nextButtonText}>Continue</Text>
          </AnimatedPressable>
        </FloatingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  progress: {
    flexDirection: 'row', gap: 6, alignItems: 'center',
  },
  progressDot: { width: 32, height: 8, borderWidth: 2, borderColor: Colors.ink, backgroundColor: Colors.white },
  progressDotActive: { backgroundColor: Colors.ink },
  progressDotDone: { backgroundColor: Colors.ink },
  backButton: { 
    paddingHorizontal: 12, paddingVertical: 8, borderWidth: 2, borderColor: Colors.ink, backgroundColor: Colors.white, ...Shadows.btn 
  },
  backText: { fontFamily: Typography.display, fontSize: 14, color: Colors.ink, letterSpacing: 1 },
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
    padding: 24, gap: 16, marginBottom: 24,
    ...Shadows.card,
  },
  cardTitle: {
    fontSize: 24, fontFamily: Typography.display, color: Colors.ink, letterSpacing: 1,
  },
  cardDesc: {
    fontSize: 14, fontFamily: Typography.body, color: 'rgba(0,0,0,0.6)', fontStyle: 'italic',
  },
  salaryContainer: {
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
  },
  salaryValueBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: Colors.ink,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    ...Shadows.card,
  },
  salaryValue: {
    fontSize: 42,
    fontFamily: Typography.display,
    color: Colors.ink,
    letterSpacing: 2,
  },
  salaryBtnRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    justifyContent: 'space-between',
  },
  salaryBtn: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.ink,
    ...Shadows.btn,
  },
  salaryBtnSelected: {
    backgroundColor: Colors.ink,
  },
  salaryBtnAdd: { backgroundColor: '#F0FDF4', borderColor: Colors.green },
  salaryBtnText: { fontSize: 20, fontFamily: Typography.display, color: Colors.ink },
  salaryBtnTextSelected: { color: Colors.white },
  salaryBtnAddText: { color: Colors.green },
  ruleCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 16,
    backgroundColor: Colors.white, borderWidth: 2, borderColor: Colors.ink,
    padding: 16, marginBottom: 16,
    ...Shadows.card,
  },
  ruleCardActive: {
    backgroundColor: Colors.white,
    shadowOffset: { width: 8, height: 8 },
    transform: [{ translateX: -4 }, { translateY: -4 }],
  },
  ruleIcon: { fontSize: 24, width: 32, textAlign: 'center' },
  ruleInfo: { flex: 1, justifyContent: 'center' },
  ruleLabel: {
    fontSize: 18, fontFamily: Typography.bodySemibold, color: Colors.ink,
  },
  ruleLabelActive: { color: Colors.ink },
  ruleDesc: {
    fontSize: 14, fontFamily: Typography.body, color: 'rgba(0,0,0,0.6)', marginTop: 4, fontStyle: 'italic',
  },
  checkbox: {
    width: 32, height: 32,
    borderWidth: 2, borderColor: Colors.ink,
    backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
    ...Shadows.btn,
  },
  checkboxActive: {
    backgroundColor: Colors.white,
    shadowOffset: { width: 6, height: 6 },
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  checkboxText: {
    fontSize: 20,
    fontFamily: Typography.display,
    color: Colors.ink,
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
});
