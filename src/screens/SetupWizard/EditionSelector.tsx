import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SetupStackParamList } from '../../navigation/SetupNavigator';
import { EDITION_LIST } from '../../data/editions';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../theme/tokens';
import { EDITIONS } from '../../data/editions';
import { AnimatedPressable } from '../../components/AnimatedPressable';
import { FloatingView } from '../../components/FloatingView';

type Nav = NativeStackNavigationProp<SetupStackParamList, 'EditionSelector'>;

export default function EditionSelector() {
  const navigation = useNavigation<Nav>();
  const [selected, setSelected] = useState<string>('standard_uk');

  const selectedEdition = EDITION_LIST.find(e => e.id === selected);

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
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
        </View>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.stepLabel}>Step 1 of 4</Text>
        <Text style={styles.title}>Choose Edition</Text>
        <Text style={styles.subtitle}>Select the version of Monopoly you're playing.</Text>

        {/* Edition Cards */}
        <View style={styles.editionList}>
          {EDITION_LIST.map((edition) => (
            <TouchableOpacity
              key={edition.id}
              style={[styles.editionCard, selected === edition.id && styles.editionCardSelected]}
              onPress={() => setSelected(edition.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.editionFlag}>{edition.flag}</Text>
              <View style={styles.editionInfo}>
                <Text style={[
                  styles.editionName,
                  selected === edition.id && styles.editionNameSelected,
                ]}>
                  {edition.name}
                </Text>
                <Text style={styles.editionHint}>
                  e.g. {edition.sampleProperty}({edition.currency})
                </Text>
              </View>
              <View style={[styles.radio, selected === edition.id && styles.radioSelected]}>
                {selected === edition.id && <Text style={styles.radioText}>✔</Text>}
              </View>
            </TouchableOpacity>
          ))}
        </View>


      </ScrollView>

      {/* CTA */}
      <View style={styles.footer}>
        <FloatingView amplitude={4} duration={1800}>
          <AnimatedPressable
            style={styles.nextButton}
            onPress={() => navigation.navigate('PlayerSetup', { edition: selected })}
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
  progressDot: {
    width: 32, height: 8, borderWidth: 2, borderColor: Colors.ink,
    backgroundColor: Colors.white,
  },
  progressDotActive: {
    backgroundColor: Colors.ink,
  },
  content: { padding: Spacing.xl, paddingBottom: 32 },
  stepLabel: {
    fontSize: 10, fontFamily: Typography.bodySemibold,
    color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    fontSize: 48, fontFamily: Typography.display,
    color: Colors.ink, marginBottom: 8, letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16, fontFamily: Typography.body, fontStyle: 'italic',
    color: 'rgba(0,0,0,0.6)', marginBottom: 32,
  },
  editionList: { gap: 16 },
  editionCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.white, borderWidth: 2, borderColor: Colors.ink,
    padding: Spacing.md,
    ...Shadows.card,
  },
  editionCardSelected: {
    backgroundColor: Colors.white,
    shadowOffset: { width: 8, height: 8 },
    transform: [{ translateX: -4 }, { translateY: -4 }],
  },
  editionFlag: { fontSize: 32 },
  editionInfo: { flex: 1 },
  editionName: {
    fontSize: 24, fontFamily: Typography.display, color: Colors.ink, letterSpacing: 1,
  },
  editionNameSelected: { color: Colors.ink },
  editionHint: {
    fontSize: 12, fontFamily: Typography.bodySemibold, color: 'rgba(0,0,0,0.5)', marginTop: 2, textTransform: 'uppercase', letterSpacing: 1,
  },
  radio: {
    width: 32, height: 32,
    borderWidth: 2, borderColor: Colors.ink,
    backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
    ...Shadows.btn,
  },
  radioSelected: {
    backgroundColor: Colors.white,
    shadowOffset: { width: 6, height: 6 },
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  radioText: {
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
