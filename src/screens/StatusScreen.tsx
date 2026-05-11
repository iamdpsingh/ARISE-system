import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, S, FONTS, RANK_COLORS } from '../theme/theme';
import { StatBar, XpBar, StreakBadge } from '../components/UIComponents';
import type { PlayerState } from '../hooks/usePlayerState';
import type { StatKey } from '../hooks/usePlayerState';

interface Props {
  state: PlayerState;
  xpPercent: number;
  onAllocate: (stat: StatKey) => void;
  onToggleSettings: () => void;
  syncing: boolean;
}

const STAT_CONFIG: { key: StatKey; label: string; color: string; desc: string }[] = [
  { key: 'strength', label: 'STRENGTH', color: '#ff4444', desc: 'Push-ups, rows, pull strength' },
  { key: 'agility', label: 'AGILITY', color: '#44ff88', desc: 'Walk speed, sprint capacity, flexibility' },
  { key: 'sense', label: 'SENSE', color: '#aaaaff', desc: 'Body awareness, breathing control, form' },
  { key: 'vitality', label: 'VITALITY', color: '#ff8844', desc: 'Stamina, immunity, energy levels' },
  { key: 'intelligence', label: 'INTELLIGENCE', color: COLORS.cyan, desc: 'Consistency, habit building, planning' },
];

const PHASE_RANK_LABEL = ['E-RANK BEGINNER', 'E-RANK HUNTER', 'D-RANK HUNTER', 'D-RANK HUNTER',
  'C-RANK HUNTER', 'C-RANK HUNTER', 'C-RANK HUNTER', 'B-RANK HUNTER', 'B-RANK HUNTER', 'A-RANK HUNTER',
  'S-RANK HUNTER', 'S-RANK HUNTER', 'S-RANK HUNTER', 'NATIONAL HUNTER', 'NATIONAL HUNTER', 'NATIONAL HUNTER',
  'NATIONAL HUNTER', 'NATIONAL HUNTER', 'SHADOW MONARCH — THE AWAKENED'];

export default function StatusScreen({ state, xpPercent, onAllocate, onToggleSettings, syncing }: Props) {
  const [showStatDesc, setShowStatDesc] = useState<StatKey | null>(null);
  const rankColor = RANK_COLORS[state.rank] ?? COLORS.cyan;
  const maxStat = 200;

  return (
    <SafeAreaView style={[S.screen, { flex: 1 }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── HEADER ─────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={S.spaceBetween}>
            <Text style={styles.systemTag}>{'[ STATUS WINDOW ]'}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {syncing && (
                <Text style={{ ...FONTS.system, color: COLORS.cyan, fontSize: 8, marginRight: 8 }}>SYNCING ARCHIVE...</Text>
              )}
              <TouchableOpacity onPress={onToggleSettings} style={styles.settingsBtn}>
                <Text style={{ fontSize: 18 }}>⚙️</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={S.spaceBetween}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={[styles.playerName, { color: rankColor }]} numberOfLines={1}>{state.name || 'HUNTER'}</Text>
              <Text style={[styles.title, { flexShrink: 1 }]} numberOfLines={2}>{state.title}</Text>
            </View>
            <View style={styles.rankBadge}>
              <Text style={[styles.rankLetter, { color: rankColor }]}>{state.rank}</Text>
              <Text style={styles.rankLabel}>RANK</Text>
            </View>
          </View>

          {/* Level + XP */}
          <View style={styles.levelRow}>
            <Text style={styles.levelLabel}>LEVEL</Text>
            <Text style={[styles.levelNum, { color: rankColor }]}>{state.level}</Text>
            <Text style={[styles.levelLabel, { flexShrink: 1, marginLeft: 8 }]} numberOfLines={1}>{PHASE_RANK_LABEL[state.currentPhase]}</Text>
          </View>
          <XpBar xp={state.xp} maxXp={state.maxXp} level={state.level} />
        </View>

        {/* ── HP / MP BARS ───────────────────────────────────── */}
        <View style={S.panel}>
          <Text style={S.sectionTitle}>Resources</Text>
          <View style={styles.hpRow}>
            <Text style={[styles.hpLabel, { color: COLORS.hp }]}>HP</Text>
            <View style={[S.barContainer, { flex: 1, marginHorizontal: 8 }]}>
              <View style={[S.barFill, { width: '100%', backgroundColor: COLORS.hp }]} />
            </View>
            <Text style={[styles.hpVal, { color: COLORS.hp }]}>{state.stats.vitality * 150} / {state.stats.vitality * 150}</Text>
          </View>
          <View style={[styles.hpRow, { marginTop: 8 }]}>
            <Text style={[styles.hpLabel, { color: COLORS.mp }]}>MP</Text>
            <View style={[S.barContainer, { flex: 1, marginHorizontal: 8 }]}>
              <View style={[S.barFill, { width: '100%', backgroundColor: COLORS.mp }]} />
            </View>
            <Text style={[styles.hpVal, { color: COLORS.mp }]}>{state.stats.intelligence * 50} / {state.stats.intelligence * 50}</Text>
          </View>
        </View>

        {/* ── STATS ─────────────────────────────────────────── */}
        <View style={S.panel}>
          <View style={S.spaceBetween}>
            <Text style={S.sectionTitle}>Attributes</Text>
            {state.statPoints > 0 && (
              <Text style={styles.pointsAvail}>
                {'[ '}{state.statPoints}{' POINTS AVAILABLE ]'}
              </Text>
            )}
          </View>

          {STAT_CONFIG.map(({ key, label, color, desc }) => (
            <TouchableOpacity
              key={key}
              onPress={() => setShowStatDesc(showStatDesc === key ? null : key)}
              style={styles.statBlock}
              activeOpacity={0.8}
            >
              <View style={S.spaceBetween}>
                <View style={{ flex: 1, paddingRight: state.statPoints > 0 ? 12 : 0 }}>
                  <StatBar label={label} value={state.stats[key]} color={color} maxValue={maxStat} />
                </View>
                {state.statPoints > 0 && (
                  <TouchableOpacity
                    onPress={() => onAllocate(key)}
                    style={[styles.allocBtn, { borderColor: color }]}
                  >
                    <Text style={[styles.allocBtnText, { color }]}>+</Text>
                  </TouchableOpacity>
                )}
              </View>
              {showStatDesc === key && (
                <Text style={styles.statDesc}>{desc}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* ── SHADOW ARMY ───────────────────────────────────── */}
        <View style={S.panel}>
          <Text style={S.sectionTitle}>Shadow Army</Text>
          <View style={styles.shadowRow}>
            {Array.from({ length: Math.max(10, state.shadowCount + 1) }).map((_, i) => (
              <Text key={i} style={[styles.shadowIcon, i < state.shadowCount ? styles.shadowActive : styles.shadowDim]}>
                ◆
              </Text>
            ))}
          </View>
          <Text style={S.subText}>{state.shadowCount} shadows raised — 1 per completed week</Text>
        </View>

        {/* ── STREAK ────────────────────────────────────────── */}
        <View style={[S.panel, S.center]}>
          <StreakBadge streak={state.streakDays} />
          <Text style={[S.subText, { marginTop: 8 }]}>
            Total days completed: {state.totalDaysCompleted}
          </Text>
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 100 },
  header: { marginBottom: 12 },
  systemTag: { ...FONTS.mono, color: COLORS.cyanDim, fontSize: 10, letterSpacing: 3, marginBottom: 12 },
  playerName: { ...FONTS.title, fontSize: 26, marginBottom: 2 },
  title: { ...FONTS.system, color: COLORS.textSub, fontSize: 11, letterSpacing: 3 },
  rankBadge: { alignItems: 'center', backgroundColor: 'rgba(0,20,60,0.8)', borderWidth: 1, borderColor: COLORS.borderNeon, padding: 12, minWidth: 72 },
  rankLetter: { ...FONTS.title, fontSize: 28 },
  rankLabel: { ...FONTS.system, color: COLORS.textSub, fontSize: 9, letterSpacing: 2 },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 10 },
  levelLabel: { ...FONTS.system, color: COLORS.textSub, fontSize: 10, letterSpacing: 2 },
  levelNum: { ...FONTS.title, fontSize: 36 },
  hpRow: { flexDirection: 'row', alignItems: 'center' },
  hpLabel: { ...FONTS.system, fontSize: 11, width: 28, letterSpacing: 1 },
  hpVal: { ...FONTS.mono, fontSize: 12, width: 90, textAlign: 'right' },
  statBlock: { marginBottom: 8 },
  statDesc: { ...FONTS.body, color: COLORS.textSub, fontSize: 11, paddingLeft: 90, paddingTop: 2, fontStyle: 'italic' },
  allocBtn: { width: 28, height: 28, borderWidth: 1, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  allocBtnText: { fontSize: 18, lineHeight: 22, fontWeight: '700' },
  pointsAvail: { ...FONTS.mono, color: COLORS.xp, fontSize: 9, letterSpacing: 2 },
  shadowRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginVertical: 8 },
  shadowIcon: { fontSize: 20 },
  shadowActive: { color: COLORS.purple },
  shadowDim: { color: 'rgba(150,150,200,0.15)' },
  bottomPad: { height: 40 },
  settingsBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 243, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 243, 255, 0.2)',
    borderRadius: 4,
    marginTop: -8,
  },
});
