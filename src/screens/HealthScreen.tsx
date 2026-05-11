import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Alert, Animated } from 'react-native';
import { COLORS, S, FONTS } from '../theme/theme';
import type { PlayerState } from '../hooks/usePlayerState';

interface Props {
  state: PlayerState;
}

const EMERGENCY_STEPS = [
  { step: '1', emoji: '🪑', title: 'Sit Upright', desc: 'Do NOT lie flat. Sit straight on bed or chair. Gravity helps breathing.' },
  { step: '2', emoji: '🫆', title: 'Start Steam Immediately', desc: 'Bowl of hot water + towel over head. Breathe slowly through nose for 5–7 min.' },
  { step: '3', emoji: '💧', title: 'Sip Warm Water', desc: 'Small sips. Not gulping. Warm — never cold. This soothes the airways.' },
  { step: '4', emoji: '🌬️', title: 'Slow Breathing', desc: '4-count inhale through nose. 6-count exhale through mouth. Repeat 10 times.' },
  { step: '5', emoji: '🛌', title: 'Elevate Head for Sleep', desc: 'Use 2 pillows if sleeping. Never flat on back. Right side is better for breathing.' },
];

export default function HealthScreen({ state }: Props) {
  const weeklyData = state.weeklyXp;
  const maxXp = Math.max(...weeklyData, 1);
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <SafeAreaView style={[S.screen, { flex: 1 }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sysTag}>{'[ HEALTH DASHBOARD ]'}</Text>

        {/* ── WEEKLY XP CHART ───────────────────────── */}
        <View style={S.panel}>
          <Text style={S.sectionTitle}>Weekly Activity (XP)</Text>
          <View style={styles.barChart}>
            {dayLabels.map((day, i) => {
              const val = weeklyData[i] || 0;
              const pct = (val / maxXp) * 100;
              return (
                <View key={day} style={styles.chartCol}>
                  <Text style={styles.chartVal}>{val > 0 ? val : ''}</Text>
                  <View style={styles.chartBarBg}>
                    <View style={[styles.chartBarFill, { height: `${pct}%` }]} />
                  </View>
                  <Text style={styles.chartLabel}>{day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── STATS OVERVIEW ────────────────────────── */}
        <View style={S.panel}>
          <Text style={S.sectionTitle}>Progress Overview</Text>
          {[
            { label: 'Current Phase', value: `Phase ${state.currentPhase} — ${['Emergency Recovery','Foundation','Sleeper Build I','Sleeper Build II','Calisthenics Core','Pull Mastery','Push Mastery','Leg Mastery','Full Body Power','Elite Body','The Awakened'][state.currentPhase]}`, color: COLORS.cyan },
            { label: 'Current Level', value: `Level ${state.level}`, color: COLORS.xp },
            { label: 'Current Rank', value: state.rank, color: COLORS.rankS },
            { label: 'Total Days Completed', value: String(state.totalDaysCompleted), color: COLORS.success },
            { label: 'Current Streak', value: `${state.streakDays} days 🔥`, color: COLORS.warning },
            { label: 'Shadow Count', value: `${state.shadowCount} shadows`, color: COLORS.purple },
          ].map(item => (
            <View key={item.label} style={styles.overviewRow}>
              <Text style={styles.overviewLabel}>{item.label}</Text>
              <Text style={[styles.overviewValue, { color: item.color }]}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* ── ALLERGY RULES ─────────────────────────── */}
        <View style={[S.panel, { borderColor: 'rgba(255,100,0,0.4)' }]}>
          <Text style={[S.sectionTitle, { color: COLORS.warning }]}>⚠ Strict Rules (No Compromise)</Text>
          {[
            '❌ Cold water or fridge items',
            '❌ Ice cream or cold drinks',
            '❌ Packaged snacks (daily habit)',
            '❌ Late-night sleeping (after 11:00 PM)',
            '❌ Skipping meals',
            '❌ Tea or coffee on empty stomach',
            '✅ 1 glass warm water every morning',
            '✅ Steam inhalation every evening',
            '✅ Sleep before 11:00 PM — minimum 7 hours',
          ].map(r => (
            <Text key={r} style={[styles.rule, r.startsWith('✅') && { color: COLORS.success }]}>{r}</Text>
          ))}
        </View>

        {/* ── PRE-SEASON PLAN ───────────────────────── */}
        <View style={[S.panel, { borderColor: 'rgba(255,200,0,0.3)' }]}>
          <Text style={[S.sectionTitle, { color: COLORS.xp }]}>📅 Pre-Season Protocol</Text>
          <Text style={styles.preSeasonNote}>Start 15 days before Feb–Mar and Oct–Nov each year.</Text>
          {[
            '💨 Steam inhalation — daily, no skip',
            '🫁 Breathing exercises — 20 min/day',
            '🚫 Zero junk food, zero cold items',
            '😴 Strict sleep by 10:30 PM',
          ].map(r => (
            <Text key={r} style={styles.preItem}>{r}</Text>
          ))}
          <Text style={[styles.preSeasonNote, { marginTop: 8, color: COLORS.warning }]}>
            This is what actually reduces attack severity next season.
          </Text>
        </View>

        {/* ── EMERGENCY PROTOCOL ────────────────────── */}
        <View style={[S.panel, { borderColor: COLORS.danger }]}>
          <Text style={[S.sectionTitle, { color: COLORS.danger }]}>🚨 Emergency Natural Control Protocol</Text>
          <Text style={styles.emergencyNote}>When symptoms suddenly start — follow in order:</Text>
          {EMERGENCY_STEPS.map(s => (
            <View key={s.step} style={styles.emergencyStep}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepNum}>{s.step}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.stepTitle}>{s.emoji} {s.title}</Text>
                <Text style={styles.stepDesc}>{s.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── EXPECTED RESULTS ─────────────────────── */}
        <View style={S.panel}>
          <Text style={S.sectionTitle}>Expected Results (if followed strictly)</Text>
          {[
            { timeframe: '2 weeks', result: 'Acidity noticeably better', color: COLORS.success },
            { timeframe: '1 month', result: 'Energy levels improve', color: COLORS.success },
            { timeframe: '2–3 months', result: 'Fewer allergy attacks', color: COLORS.cyan },
            { timeframe: 'Next season', result: 'Much milder symptoms', color: COLORS.xp },
          ].map(r => (
            <View key={r.timeframe} style={styles.resultRow}>
              <Text style={styles.resultTime}>{r.timeframe}</Text>
              <Text style={[styles.resultVal, { color: r.color }]}>→ {r.result}</Text>
            </View>
          ))}
          <Text style={styles.finalNote}>
            Discipline will fix this, not motivation.{'\n'}Small daily habits {'>'} big temporary efforts.
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16 },
  sysTag: { ...FONTS.mono, color: COLORS.cyanDim, fontSize: 10, letterSpacing: 3, marginBottom: 12 },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 100, paddingTop: 16 },
  chartCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  chartBarBg: { width: 24, height: 70, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', justifyContent: 'flex-end' },
  chartBarFill: { backgroundColor: COLORS.cyan, width: '100%', borderRadius: 2 },
  chartLabel: { ...FONTS.body, color: COLORS.textSub, fontSize: 9, marginTop: 4, textTransform: 'uppercase' },
  chartVal: { ...FONTS.mono, color: COLORS.xp, fontSize: 9, marginBottom: 2 },
  overviewRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.borderDim },
  overviewLabel: { ...FONTS.body, color: COLORS.textSub, fontSize: 12 },
  overviewValue: { ...FONTS.mono, fontSize: 12 },
  rule: { ...FONTS.body, color: COLORS.textPrimary, fontSize: 13, paddingVertical: 4 },
  preSeasonNote: { ...FONTS.body, color: COLORS.textSub, fontSize: 12, marginBottom: 8, fontStyle: 'italic' },
  preItem: { ...FONTS.body, color: COLORS.textPrimary, fontSize: 13, paddingVertical: 3 },
  emergencyNote: { ...FONTS.body, color: COLORS.textSub, fontSize: 12, marginBottom: 12, fontStyle: 'italic' },
  emergencyStep: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  stepBadge: { width: 32, height: 32, borderWidth: 1, borderColor: COLORS.danger, alignItems: 'center', justifyContent: 'center', borderRadius: 4 },
  stepNum: { ...FONTS.mono, color: COLORS.danger, fontSize: 14 },
  stepTitle: { ...FONTS.system, color: COLORS.textPrimary, fontSize: 13, marginBottom: 2 },
  stepDesc: { ...FONTS.body, color: COLORS.textSub, fontSize: 12, lineHeight: 18 },
  resultRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.borderDim, gap: 12 },
  resultTime: { ...FONTS.mono, color: COLORS.textSub, fontSize: 12, width: 90 },
  resultVal: { ...FONTS.body, fontSize: 13, flex: 1 },
  finalNote: { ...FONTS.body, color: COLORS.textSub, fontSize: 12, marginTop: 14, textAlign: 'center', lineHeight: 20, fontStyle: 'italic' },
  purple: { color: COLORS.purple },
});
