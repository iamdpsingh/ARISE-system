import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, S, FONTS } from '../theme/theme';
import { CheckItem } from '../components/UIComponents';
import { PHASES } from '../data/phases';
import type { PlayerState } from '../hooks/usePlayerState';

interface Props {
  state: PlayerState;
  onMarkRoutine: (key: 'breathingDone' | 'steamDone' | 'sunlightDone' | 'walkDone') => void;
  onCompleteExercise: (id: string, xp: number) => void;
  onCompleteDailyAll: () => void;
  onLogEnergy: (level: number) => void;
  onLogSymptoms: (val: 'ok' | 'mild' | 'bad') => void;
  onLogSleep: (hours: number) => void;
  onEmergency: () => void;
}

export default function DailyQuestScreen({
  state, onMarkRoutine, onCompleteExercise, onCompleteDailyAll,
  onLogEnergy, onLogSymptoms, onLogSleep, onEmergency,
}: Props) {
  const phase = PHASES[state.currentPhase];
  const today = state.today;
  const [expandedDay, setExpandedDay] = useState<number>(0);

  const routine = [
    { key: 'breathingDone' as const, label: '5:00 AM Breathing (Anulom Vilom + Bhramari)', done: today.breathingDone, xp: 25 },
    { key: 'steamDone' as const, label: 'Evening steam inhalation — 5–7 min', done: today.steamDone, xp: 25 },
    { key: 'sunlightDone' as const, label: 'Sit in sunlight — 10 min', done: today.sunlightDone, xp: 15 },
    { key: 'walkDone' as const, label: 'Walk at conversational pace', done: today.walkDone, xp: 30 },
  ];

  // Systematically append dynamic completion states
  const hasWater = today.waterMl >= today.targetWaterMl;
  
  const totalRoutineCount = routine.length + 1; // including water target
  const doneCount = routine.filter(r => r.done).length + (hasWater ? 1 : 0);
  const totalXpToday = today.xpEarnedToday;

  const sleepOptions = [5, 6, 7, 8, 9];
  const energyEmoji = ['😵', '😞', '😐', '🙂', '💪'];

  // Calculate if everything for today is finished
  // 1. Routine items (Breathing, Steam, etc.)
  const routineAllDone = routine.every(r => r.done);
  // 2. Training for the day (finding today's index in the schedule)
  const currentDayIdx = new Date().getDay(); // 0 is Sunday, 1 is Monday...
  const mappedDayIdx = phase.schedule.length > 0 ? currentDayIdx % phase.schedule.length : 0;
  const dayInSchedule = idxToPhaseDay(state.currentPhase, mappedDayIdx);
  const trainingKey = `day_${mappedDayIdx}`;
  const trainingDone = !!today.questsCompleted[trainingKey] || dayInSchedule?.type === 'rest';
  
  const canCompleteDay = routineAllDone && hasWater && trainingDone;
  const isDayFinished = today.allDailyCompleted;

  function idxToPhaseDay(phaseIdx: number, dayIdx: number) {
     const schedule = PHASES[phaseIdx].schedule;
     return schedule[dayIdx] || schedule[0];
  }

  return (
    <SafeAreaView style={[S.screen, { flex: 1 }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── HEADER ───────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.sysTag}>{'[ DAILY QUEST LOG ]'}</Text>
          <View style={S.spaceBetween}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={[S.titleText, { flexShrink: 1 }]} numberOfLines={2}>PHASE {state.currentPhase}: {phase.name.toUpperCase()}</Text>
              <Text style={[S.subText, { flexShrink: 1 }]} numberOfLines={2}>{phase.subtitle}</Text>
            </View>
            <View style={styles.xpBubble}>
              <Text style={styles.xpBubbleTxt}>+{totalXpToday}</Text>
              <Text style={styles.xpBubbleLbl}>XP TODAY</Text>
            </View>
          </View>
        </View>

        {/* ── HEALTH ROUTINE ────────────────────────── */}
        <View style={S.panel}>
          <View style={S.spaceBetween}>
            <Text style={S.sectionTitle}>Daily Health Routine</Text>
            <Text style={styles.routineCount}>{doneCount}/{totalRoutineCount} done</Text>
          </View>
          {routine.map(r => (
            <CheckItem
              key={r.key}
              label={r.label}
              done={r.done}
              xpReward={r.xp}
              onPress={() => onMarkRoutine(r.key)}
            />
          ))}
          <CheckItem
            label={`Hydration Protocol (${(today.waterMl/1000).toFixed(1)} / ${(today.targetWaterMl/1000).toFixed(1)}L)`}
            done={hasWater}
            xpReward={0}
            onPress={() => Alert.alert('Hydration', 'Log your water intake in the Nutrition tab.')}
          />
        </View>

        {/* ── SYMPTOM / ENERGY / SLEEP LOG ──────────── */}
        <View style={S.panel}>
          <Text style={S.sectionTitle}>Health Check-In</Text>

          {/* Energy */}
          <Text style={styles.subLabel}>ENERGY LEVEL</Text>
          <View style={styles.emojiRow}>
            {energyEmoji.map((e, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => onLogEnergy(i + 1)}
                style={[styles.emojiBtn, state.today.energyLevel === i + 1 && styles.emojiBtnActive]}
              >
                <Text style={styles.emojiText}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Symptoms */}
          <Text style={[styles.subLabel, { marginTop: 12 }]}>SYMPTOMS TODAY</Text>
          <View style={styles.emojiRow}>
            {[
              { val: 'ok' as const, label: '✅ All OK', color: COLORS.success },
              { val: 'mild' as const, label: '🟡 Mild', color: COLORS.warning },
              { val: 'bad' as const, label: '🔴 Bad Day', color: COLORS.danger },
            ].map(s => (
              <TouchableOpacity
                key={s.val}
                onPress={() => onLogSymptoms(s.val)}
                style={[styles.symptomBtn, today.symptomsLog === s.val && { borderColor: s.color, backgroundColor: `${s.color}18` }]}
              >
                <Text style={[styles.symptomTxt, today.symptomsLog === s.val && { color: s.color }]}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sleep */}
          <Text style={[styles.subLabel, { marginTop: 12 }]}>SLEEP LAST NIGHT</Text>
          <View style={styles.emojiRow}>
            {sleepOptions.map(h => (
              <TouchableOpacity
                key={h}
                onPress={() => onLogSleep(h)}
                style={[styles.sleepBtn, today.sleepHours === h && styles.sleepBtnActive]}
              >
                <Text style={[styles.sleepTxt, today.sleepHours === h && { color: COLORS.cyan }]}>{h}h</Text>
              </TouchableOpacity>
            ))}
          </View>
          {today.sleepHours > 0 && today.sleepHours < 7 && (
            <Text style={styles.sleepWarn}>⚠ Less than 7 hours reduces recovery. Try to sleep earlier tonight.</Text>
          )}
        </View>

        {/* ── TODAY'S WORKOUTS ──────────────────────── */}
        <View style={S.panel}>
          <Text style={S.sectionTitle}>Today's Training</Text>
          {phase.schedule.map((day, idx) => {
            const isExpanded = expandedDay === idx;
            const dayXpKey = `day_${idx}`;
            const dayDone = !!today.questsCompleted[dayXpKey];

            return (
              <View key={idx} style={[styles.dayCard, dayDone && styles.dayCardDone]}>
                <TouchableOpacity
                  onPress={() => setExpandedDay(isExpanded ? -1 : idx)}
                  style={styles.dayHeader}
                >
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={[styles.dayLabel, dayDone && styles.dayLabelDone, { flexShrink: 1 }]} numberOfLines={2}>{day.label}</Text>
                    {day.cardioNote && <Text style={[styles.cardioNote, { flexShrink: 1 }]} numberOfLines={2}>{day.cardioNote}</Text>}
                  </View>
                  <Text style={styles.dayChevron}>{isExpanded ? '▲' : '▼'}</Text>
                </TouchableOpacity>

                {isExpanded && (
                  <>
                    {day.exercises.map((ex, ej) => {
                      const exKey = `ex_${idx}_${ej}`;
                      const exDone = !!today.questsCompleted[exKey];
                      return (
                        <CheckItem
                          key={exKey}
                          label={`${ex.name}  ${ex.sets}×${ex.reps}  |  Rest: ${ex.rest}`}
                          done={exDone}
                          xpReward={15}
                          onPress={() => onCompleteExercise(exKey, 15)}
                        />
                      );
                    })}
                    {!dayDone && (
                      <TouchableOpacity
                        style={[S.glowBtn, { marginTop: 12 }]}
                        onPress={() => onCompleteExercise(dayXpKey, 80)}
                      >
                        <Text style={S.glowBtnText}>COMPLETE THIS SESSION +80 XP</Text>
                      </TouchableOpacity>
                    )}
                    {dayDone && (
                      <Text style={styles.sessionDoneLabel}>✓ SESSION COMPLETED</Text>
                    )}
                  </>
                )}
              </View>
            );
          })}
        </View>

        {/* ── EMERGENCY BUTTON ─────────────────────── */}
        {today.symptomsLog === 'bad' && (
          <TouchableOpacity style={[S.dangerBtn, { marginTop: 8 }]} onPress={onEmergency}>
            <Text style={S.dangerBtnText}>⚠ ACTIVATE EMERGENCY PROTOCOL</Text>
          </TouchableOpacity>
        )}

        {/* ── DAILY COMPLETION ─────────────────────── */}
        {!isDayFinished ? (
          <TouchableOpacity 
            style={[S.glowBtn, { marginTop: 20, height: 60, opacity: canCompleteDay ? 1 : 0.4 }]} 
            onPress={() => {
              if (canCompleteDay) onCompleteDailyAll();
              else Alert.alert('Quest Incomplete', 'You must finish the core routine, hydration, and today\'s training before the System accepts your results.');
            }}
          >
            <Text style={S.glowBtnText}>
              {canCompleteDay ? '⚔ [ COMPLETE DAILY QUEST ] ⚔' : '🔒 [ MISSION IN PROGRESS ]'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={[S.panel, { borderColor: COLORS.success, backgroundColor: 'rgba(0,50,0,0.1)', marginTop: 20 }]}>
            <Text style={{ ...FONTS.system, color: COLORS.success, textAlign: 'center', fontSize: 14 }}>✓ DAILY MISSION ACCOMPLISHED</Text>
            <Text style={{ ...FONTS.body, color: COLORS.textSub, textAlign: 'center', fontSize: 11, marginTop: 4 }}>The Shadow Army has grown stronger today.</Text>
          </View>
        )}

        {/* ── PRE-SEASON WARNING ───────────────────── */}
        <View style={styles.preSeasonNote}>
          <Text style={styles.preSeasonTxt}>
            📅 PRE-SEASON: Start strict protocol 15 days before Feb–Mar & Oct–Nov.
            Steam daily. Zero junk. Zero cold items.
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16 },
  header: { marginBottom: 12 },
  sysTag: { ...FONTS.mono, color: COLORS.cyanDim, fontSize: 10, letterSpacing: 3, marginBottom: 10 },
  xpBubble: { backgroundColor: 'rgba(240,192,64,0.1)', borderWidth: 1, borderColor: COLORS.xp, padding: 10, alignItems: 'center', minWidth: 80 },
  xpBubbleTxt: { ...FONTS.title, color: COLORS.xp, fontSize: 18 },
  xpBubbleLbl: { ...FONTS.system, color: COLORS.xp, fontSize: 9, letterSpacing: 2 },
  routineCount: { ...FONTS.mono, color: COLORS.cyanDim, fontSize: 11 },
  subLabel: { ...FONTS.system, color: COLORS.textSub, fontSize: 10, letterSpacing: 2, marginBottom: 6 },
  emojiRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  emojiBtn: { padding: 8, borderWidth: 1, borderColor: COLORS.borderDim, borderRadius: 4 },
  emojiBtnActive: { borderColor: COLORS.cyan, backgroundColor: COLORS.cyanGlow },
  emojiText: { fontSize: 22 },
  symptomBtn: { paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: COLORS.borderDim, borderRadius: 4 },
  symptomTxt: { ...FONTS.system, color: COLORS.textSub, fontSize: 11 },
  sleepBtn: { width: 44, height: 44, borderWidth: 1, borderColor: COLORS.borderDim, alignItems: 'center', justifyContent: 'center', borderRadius: 4 },
  sleepBtnActive: { borderColor: COLORS.cyan, backgroundColor: COLORS.cyanGlow },
  sleepTxt: { ...FONTS.mono, color: COLORS.textSub, fontSize: 13 },
  sleepWarn: { ...FONTS.body, color: COLORS.warning, fontSize: 11, marginTop: 8, fontStyle: 'italic' },
  dayCard: { borderWidth: 1, borderColor: COLORS.borderDim, marginBottom: 8, backgroundColor: 'rgba(0,15,40,0.4)' },
  dayCardDone: { opacity: 0.6 },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  dayLabel: { ...FONTS.system, color: COLORS.textPrimary, fontSize: 13 },
  dayLabelDone: { textDecorationLine: 'line-through', color: COLORS.textSub },
  cardioNote: { ...FONTS.body, color: COLORS.textSub, fontSize: 11, marginTop: 2 },
  dayChevron: { color: COLORS.cyanDim, fontSize: 12 },
  sessionDoneLabel: { ...FONTS.system, color: COLORS.success, fontSize: 11, letterSpacing: 2, padding: 10, textAlign: 'center' },
  preSeasonNote: { borderWidth: 1, borderColor: 'rgba(255,150,0,0.3)', backgroundColor: 'rgba(255,100,0,0.06)', padding: 12, marginTop: 8 },
  preSeasonTxt: { ...FONTS.body, color: COLORS.warning, fontSize: 12, lineHeight: 18 },
});
