import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useGameStore } from '../store/useGameStore';
import { Colors, Typography, Spacing, Shadows } from '../theme/tokens';

interface Props {
  onClose: () => void;
}

export default function HouseRulesPanel({ onClose }: Props) {
  const { session, toggleHouseRule } = useGameStore();
  if (!session) return null;

  const { houseRules, editionConfig } = session;

  const RULES = [
    {
      key: 'noBankruptcy' as const,
      label: 'No Bankruptcy',
      description: 'Players can go negative and owe debt. No eliminations.',
      icon: '🏛',
    },
    {
      key: 'infiniteBankMoney' as const,
      label: 'Infinite Bank Money',
      description: 'The Bank never runs out of cash.',
      icon: '♾',
    },
  ];

  const symbol = editionConfig.currency.symbol;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>House Rules</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>DONE</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Salary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GO Salary</Text>
          <View style={styles.salaryRow}>
            <Text style={styles.salaryValue}>{symbol}{houseRules.startingBonus.toLocaleString()}</Text>
            <View style={styles.salaryButtons}>
              {[50, 100, 200, 500].map(increment => (
                <TouchableOpacity
                  key={increment}
                  style={styles.salaryAdjustBtn}
                  onPress={() => toggleHouseRule('startingBonus', Math.max(0, houseRules.startingBonus - increment))}
                >
                  <Text style={styles.salaryAdjustText}>-{increment}</Text>
                </TouchableOpacity>
              ))}
              {[50, 100, 200, 500].map(increment => (
                <TouchableOpacity
                  key={increment + '_add'}
                  style={[styles.salaryAdjustBtn, styles.salaryAdjustAdd]}
                  onPress={() => toggleHouseRule('startingBonus', houseRules.startingBonus + increment)}
                >
                  <Text style={[styles.salaryAdjustText, styles.salaryAdjustAddText]}>+{increment}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Toggle Rules */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rules</Text>
          {RULES.map((rule) => (
            <View key={rule.key} style={styles.ruleRow}>
              <View style={styles.ruleIconBox}>
                <Text style={styles.ruleIcon}>{rule.icon}</Text>
              </View>
              <View style={styles.ruleInfo}>
                <Text style={styles.ruleLabel}>{rule.label}</Text>
                <Text style={styles.ruleDescription}>{rule.description}</Text>
              </View>
              <Switch
                value={houseRules[rule.key] as boolean}
                onValueChange={(val) => toggleHouseRule(rule.key, val)}
                trackColor={{ false: 'rgba(0,0,0,0.1)', true: Colors.ink }}
                thumbColor={Colors.white}
              />
            </View>
          ))}
        </View>

        {/* Custom Rules */}
        {houseRules.customRules.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Custom Rules</Text>
            {houseRules.customRules.map(rule => (
              <View key={rule.id} style={styles.ruleRow}>
                <View style={styles.ruleIconBox}>
                  <Text style={styles.ruleIcon}>✦</Text>
                </View>
                <View style={styles.ruleInfo}>
                  <Text style={styles.ruleLabel}>{rule.name}</Text>
                  {rule.description && (
                    <Text style={styles.ruleDescription}>{rule.description}</Text>
                  )}
                </View>
                <Switch
                  value={rule.isActive}
                  onValueChange={(val) => {}}
                  trackColor={{ false: 'rgba(0,0,0,0.1)', true: Colors.ink }}
                  thumbColor={Colors.white}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingVertical: 24, borderBottomWidth: 4, borderBottomColor: 'rgba(0,0,0,0.1)',
    backgroundColor: Colors.cream,
  },
  title: { fontSize: 32, fontFamily: Typography.display, color: Colors.ink, letterSpacing: 1 },
  closeButton: { 
    paddingHorizontal: 16, paddingVertical: 8, 
    borderWidth: 2, borderColor: Colors.ink, backgroundColor: Colors.white,
    ...Shadows.btn
  },
  closeText: { fontSize: 14, fontFamily: Typography.display, color: Colors.ink, letterSpacing: 2 },
  content: { padding: 24, gap: 32 },
  section: {
    backgroundColor: Colors.white, borderWidth: 2, borderColor: Colors.ink, padding: 20, gap: 16,
    ...Shadows.card
  },
  sectionTitle: {
    fontSize: 12, fontFamily: Typography.display,
    color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: 2,
    marginBottom: -8,
  },
  salaryRow: { gap: 16 },
  salaryValue: { fontSize: 48, fontFamily: Typography.display, color: Colors.ink, textAlign: 'center' },
  salaryButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  salaryAdjustBtn: {
    flex: 1, minWidth: 60, height: 40, backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.ink,
    ...Shadows.btn
  },
  salaryAdjustAdd: { backgroundColor: '#F0FDF4', borderColor: Colors.green },
  salaryAdjustText: { fontSize: 16, fontFamily: Typography.display, color: Colors.ink },
  salaryAdjustAddText: { color: Colors.green },
  ruleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 16, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  ruleIconBox: {
    width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: Colors.ink, backgroundColor: Colors.cream,
    alignItems: 'center', justifyContent: 'center',
  },
  ruleIcon: { fontSize: 20 },
  ruleInfo: { flex: 1, justifyContent: 'center' },
  ruleLabel: { fontSize: 16, fontFamily: Typography.bodySemibold, color: Colors.ink },
  ruleDescription: {
    fontSize: 12, fontFamily: Typography.body, color: 'rgba(0,0,0,0.5)', marginTop: 4, fontStyle: 'italic'
  },
});
