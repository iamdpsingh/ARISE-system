import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, S, FONTS, RANK_COLORS } from '../theme/theme';
import { PHASES } from '../data/phases';
import type { PlayerState } from '../hooks/usePlayerState';

interface Props {
  state: PlayerState;
  onAdvancePhase: () => void;
}

export default function PhaseMapScreen({ state, onAdvancePhase }: Props) {
  return (
    <SafeAreaView style={[S.screen, { flex: 1 }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sysTag}>{'[ THE SYSTEM — PHASE MAP ]'}</Text>
        <Text style={styles.subtitle}>Your journey from The Weakest to Shadow Monarch</Text>

        {PHASES.map((phase, idx) => {
          const isCompleted = state.completedPhases.includes(idx);
          const isCurrent = state.currentPhase === idx;
          const isLocked = !isCompleted && !isCurrent;
          const rankColor = RANK_COLORS[phase.rank] ?? COLORS.cyan;
          const requiredDays = PHASES
            .slice(0, idx + 1)
            .reduce((sum, item) => sum + item.durationWeeks * 7, 0);

          return (
            <View key={idx} style={[
              styles.phaseCard,
              isCompleted && styles.completedCard,
              isCurrent && { borderColor: rankColor, borderWidth: 1.5 },
              isLocked && styles.lockedCard,
            ]}>
              {/* Connecting line */}
              {idx > 0 && (
                <View style={[styles.connector, isCompleted && { backgroundColor: COLORS.success }]} />
              )}

              <View style={styles.phaseHeader}>
                {/* Phase number badge */}
                <View style={[styles.phaseBadge, { borderColor: isLocked ? COLORS.textDim : rankColor }]}>
                  <Text style={[styles.phaseNumText, { color: isLocked ? COLORS.textDim : rankColor }]}>
                    {isCompleted ? '✓' : idx === 18 ? '∞' : String(idx).padStart(2, '0')}
                  </Text>
                </View>

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={S.row}>
                    <Text style={[styles.phaseName, isLocked && styles.lockedText, { flexShrink: 1, marginRight: 8 }]} numberOfLines={2}>{phase.name.toUpperCase()}</Text>
                    {isCurrent && <View style={styles.activePill}><Text style={styles.activePillText}>ACTIVE</Text></View>}
                  </View>
                  <Text style={[styles.phaseSubtitle, isLocked && styles.lockedText]}>{phase.subtitle}</Text>
                  <View style={styles.metaRow}>
                    <Text style={[styles.rankPill, { color: rankColor, borderColor: rankColor }]}>
                      {phase.rank}-RANK
                    </Text>
                    <Text style={styles.duration}>{phase.duration}</Text>
                  </View>
                </View>
              </View>

              {/* Phase details */}
              <>
                <Text style={styles.phaseDesc}>{phase.description}</Text>

                {/* Nutrition targets */}
                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionItem}>🔥 {phase.calorieTarget}</Text>
                  <Text style={styles.nutritionItem}>💪 {phase.proteinTarget}</Text>
                </View>

                {/* Readiness checks */}
                <View style={styles.readinessBox}>
                  <Text style={styles.readinessTitle}>
                    {isCompleted ? '✅ PHASE REQUIREMENTS MET' : isLocked ? '🔒 PREVIEW (LOCKED)' : '⬡ READINESS CHECKLIST'}
                  </Text>
                  {phase.readiness.checks.map((check, ci) => (
                    <Text key={ci} style={[
                      styles.readinessItem,
                      isCompleted && styles.readyDone,
                      isLocked && styles.lockedText,
                    ]}>
                      {isCompleted ? '✓ ' : '· '}{check}
                    </Text>
                  ))}
                </View>

                {/* Advance button */}
                {isCurrent && idx < 18 && (
                  state.totalDaysCompleted >= requiredDays ? (
                    <TouchableOpacity
                      style={[S.glowBtn, { marginTop: 12, borderColor: rankColor }]}
                      onPress={onAdvancePhase}
                    >
                      <Text style={[S.glowBtnText, { color: rankColor, textAlign: 'center' }]}>
                        ADVANCE TO PHASE {idx + 1}: {PHASES[idx + 1]?.name.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={{ marginTop: 12, padding: 12, backgroundColor: 'rgba(255,50,50,0.1)', borderWidth: 1, borderColor: COLORS.danger }}>
                       <Text style={{ ...FONTS.system, color: COLORS.danger, fontSize: 11, textAlign: 'center' }}>
                         SYSTEM LOCK: REQUIRES {requiredDays} TOTAL COMPLETED DAYS
                       </Text>
                       <Text style={{ ...FONTS.body, color: COLORS.textSub, fontSize: 10, textAlign: 'center', marginTop: 4 }}>
                         Current progress: {state.totalDaysCompleted} completed days.
                       </Text>
                    </View>
                  )
                )}
                {isCurrent && idx === 18 && (
                  <Text style={styles.monarchText}>
                    You have awakened. The system is now within you.
                  </Text>
                )}
              </>

              {/* Locked state */}
              {isLocked && (
                <Text style={styles.lockedLabel}>🔒 Complete Phase {idx - 1} first</Text>
              )}
            </View>
          );
        })}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16 },
  sysTag: { ...FONTS.mono, color: COLORS.cyanDim, fontSize: 10, letterSpacing: 3, marginBottom: 6 },
  subtitle: { ...FONTS.body, color: COLORS.textSub, fontSize: 13, marginBottom: 20 },

  phaseCard: {
    borderWidth: 1, borderColor: COLORS.borderDim,
    backgroundColor: 'rgba(0,12,35,0.7)',
    padding: 16, marginBottom: 4,
    position: 'relative',
  },
  completedCard: { borderColor: COLORS.success, backgroundColor: 'rgba(0,30,15,0.5)' },
  lockedCard: { opacity: 0.72 },
  connector: { position: 'absolute', top: -4, left: 35, width: 2, height: 8, backgroundColor: COLORS.borderDim },

  phaseHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  phaseBadge: {
    width: 50, height: 50, borderWidth: 1, borderRadius: 4,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,10,30,0.8)',
  },
  phaseNumText: { ...FONTS.mono, fontSize: 16, fontWeight: '700' },

  phaseName: { ...FONTS.title, color: COLORS.textPrimary, fontSize: 14, marginBottom: 2 },
  phaseSubtitle: { ...FONTS.body, color: COLORS.textSub, fontSize: 12, marginBottom: 6 },
  lockedText: { color: COLORS.textDim },

  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rankPill: { ...FONTS.mono, fontSize: 10, borderWidth: 1, paddingHorizontal: 6, paddingVertical: 2 },
  duration: { ...FONTS.body, color: COLORS.textSub, fontSize: 11 },

  activePill: { marginLeft: 8, backgroundColor: COLORS.cyanGlow, borderWidth: 1, borderColor: COLORS.cyan, paddingHorizontal: 8, paddingVertical: 2 },
  activePillText: { ...FONTS.system, color: COLORS.cyan, fontSize: 8, letterSpacing: 2 },

  phaseDesc: { ...FONTS.body, color: COLORS.textSub, fontSize: 12, lineHeight: 18, marginVertical: 10 },

  nutritionRow: { flexDirection: 'row', gap: 16, marginBottom: 10 },
  nutritionItem: { ...FONTS.mono, color: COLORS.textSub, fontSize: 11 },

  readinessBox: { backgroundColor: 'rgba(0,15,40,0.6)', borderWidth: 1, borderColor: COLORS.borderDim, padding: 10 },
  readinessTitle: { ...FONTS.system, color: COLORS.cyan, fontSize: 10, letterSpacing: 2, marginBottom: 8 },
  readinessItem: { ...FONTS.body, color: COLORS.textSub, fontSize: 12, lineHeight: 20 },
  readyDone: { color: COLORS.success, textDecorationLine: 'line-through' },

  lockedLabel: { ...FONTS.body, color: COLORS.textDim, fontSize: 12, marginTop: 8, fontStyle: 'italic' },
  monarchText: { ...FONTS.system, color: COLORS.rankMonarch, fontSize: 13, textAlign: 'center', marginTop: 16, letterSpacing: 2 },
});
