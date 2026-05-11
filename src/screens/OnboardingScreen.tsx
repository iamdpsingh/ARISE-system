import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet, KeyboardAvoidingView, Platform
} from 'react-native';
import { COLORS, S, FONTS } from '../theme/theme';

interface Props {
  onComplete: (name: string) => void;
}

export default function OnboardingScreen({ onComplete }: Props) {
  const [name, setName] = useState('');
  const [step, setStep] = useState(0);

  const messages = [
    'Initiating System...',
    'Scanning host body...',
    'Low immunity detected.',
    'Weak musculature confirmed.',
    'Gut and allergy issues logged.',
    'Player profile created.',
    'Rank: E. Classification: The Weakest.',
    'The System has chosen you.',
    'Your path to awakening begins now.',
  ];

  if (step < messages.length) {
    return (
      <SafeAreaView style={[S.screen, S.center]}>
        <Text style={styles.initMsg}>{messages[step]}</Text>
        <TouchableOpacity onPress={() => setStep(s => s + 1)} style={styles.continueBtn}>
          <Text style={styles.continueTxt}>{'[ TAP TO CONTINUE ]'}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={S.screen}>
      <KeyboardAvoidingView
        style={[S.screen, S.center, { padding: 32 }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Text style={styles.sysTag}>{'[ SYSTEM INITIALIZATION COMPLETE ]'}</Text>
        <Text style={styles.prompt}>What is your name, Hunter?</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name..."
          placeholderTextColor={COLORS.textDim}
          autoFocus
          maxLength={24}
          autoCorrect={false}
        />
        <TouchableOpacity
          style={[S.glowBtn, { width: '100%', marginTop: 16, opacity: name.trim() ? 1 : 0.4 }]}
          onPress={() => name.trim() && onComplete(name.trim().toUpperCase())}
          disabled={!name.trim()}
        >
          <Text style={S.glowBtnText}>ARISE</Text>
        </TouchableOpacity>
        <Text style={styles.flavorText}>
          {'"I have never thought about leaving anything for others."'}
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  initMsg: { ...FONTS.system, color: COLORS.cyan, fontSize: 18, textAlign: 'center', letterSpacing: 3, lineHeight: 30 },
  continueBtn: { marginTop: 40, borderWidth: 1, borderColor: COLORS.borderNeon, paddingHorizontal: 24, paddingVertical: 10 },
  continueTxt: { ...FONTS.mono, color: COLORS.cyanDim, fontSize: 12, letterSpacing: 3 },
  sysTag: { ...FONTS.mono, color: COLORS.cyanDim, fontSize: 10, letterSpacing: 3, marginBottom: 24, textAlign: 'center' },
  prompt: { ...FONTS.title, color: COLORS.textPrimary, fontSize: 20, textAlign: 'center', marginBottom: 24 },
  input: {
    width: '100%', borderWidth: 1, borderColor: COLORS.borderNeon,
    backgroundColor: 'rgba(0, 20, 55, 0.6)',
    color: COLORS.cyan, padding: 16, fontSize: 20,
    ...FONTS.title, textAlign: 'center', letterSpacing: 4,
  },
  flavorText: {
    ...FONTS.body, color: COLORS.textDim, fontSize: 12,
    fontStyle: 'italic', textAlign: 'center', marginTop: 40, lineHeight: 20,
  },
});
