import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, S, FONTS } from '../theme/theme';
import type { PlayerState } from '../hooks/usePlayerState';
import type { DailyLogEntry, PhaseLogEntry } from '../services/dailyLogService';

interface Props {
  state: PlayerState;
}

type LogEntry = DailyLogEntry | PhaseLogEntry;

function uploadLabel(status: string) {
  if (status === 'uploaded') return 'UPLOADED';
  if (status === 'failed') return 'UPLOAD FAILED';
  return 'PENDING UPLOAD';
}

export default function HistoryScreen({ state }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const activeDailyLogs = [...(state.dailyLogs || [])];
  const phaseLogs = [...(state.phaseLogs || [])];
  const hasLogs = activeDailyLogs.length > 0 || phaseLogs.length > 0;

  const renderDailyDetails = (log: DailyLogEntry) => (
    <View style={styles.details}>
      <View style={styles.divider} />
      <Text style={styles.detailTitle}>DAY DETAILS</Text>
      <InfoRow label="Phase Day" value={String(log.phaseDay)} />
      <InfoRow label="App Day" value={String(log.appDay)} />
      <InfoRow label="Morning" value={log.morningSessionCompleted ? 'Completed' : 'Missed'} />
      <InfoRow label="Other" value={log.otherSessionCompleted ? 'Completed' : 'Missed'} />
      <InfoRow label="Exercise" value={log.exerciseCompleted ? 'Completed' : 'Missed'} />
      <InfoRow label="Water" value={`${log.waterMl}/${log.waterTargetMl} ml`} />
      <InfoRow label="Calories" value={`${log.calories} kcal`} />
      <InfoRow label="Meals" value={log.mealStatus} />
      <InfoRow label="Rest Day" value={log.restDay ? 'Yes' : 'No'} />
      <InfoRow label="Streak" value={log.streakMaintained ? `Maintained (${log.streakAfterDay})` : 'Broken'} />

      <Text style={[styles.detailTitle, { marginTop: 12 }]}>COMPLETED TARGETS</Text>
      {(log.completedTargets.length ? log.completedTargets : ['None recorded']).map(item => (
        <Text key={item} style={styles.detailLine}>- {item}</Text>
      ))}

      <Text style={[styles.detailTitle, { marginTop: 12 }]}>MISSED TARGETS</Text>
      {(log.missedTargets.length ? log.missedTargets : ['None']).map(item => (
        <Text key={item} style={styles.detailLine}>- {item}</Text>
      ))}

      {log.notes.length > 0 && (
        <>
          <Text style={[styles.detailTitle, { marginTop: 12 }]}>NOTES</Text>
          {log.notes.map(item => (
            <Text key={item} style={styles.detailLine}>- {item}</Text>
          ))}
        </>
      )}
    </View>
  );

  const renderPhaseDetails = (log: PhaseLogEntry) => (
    <View style={styles.details}>
      <View style={styles.divider} />
      <Text style={styles.detailTitle}>PHASE SUMMARY</Text>
      <InfoRow label="Window" value={`${log.startDate} to ${log.endDate}`} />
      <InfoRow label="Days" value={String(log.totalDays)} />
      <InfoRow label="Completed" value={String(log.completedDays)} />
      <InfoRow label="Missed" value={String(log.missedDays)} />
      <InfoRow label="Rest Days" value={String(log.restDays)} />
      <InfoRow label="Streak Days" value={String(log.streakMaintainedDays)} />
      <InfoRow label="Morning" value={`${log.morningCompletedDays}/${log.totalDays}`} />
      <InfoRow label="Exercise" value={`${log.exerciseCompletedDays}/${log.totalDays}`} />
      <InfoRow label="Meals" value={`${log.mealLoggedDays}/${log.totalDays}`} />
      <InfoRow label="Calories" value={`${log.calorieAverage} kcal/day`} />
      <InfoRow label="Water" value={`${log.waterTargetDays}/${log.totalDays} target days`} />
      <InfoRow label="Targets" value={`${log.targetCompletionPercent}%`} />
      <Text style={[styles.detailTitle, { marginTop: 12 }]}>RESULT</Text>
      <Text style={styles.detailLine}>{log.summary}</Text>
    </View>
  );

  const renderLogCard = (log: LogEntry) => {
    const isExpanded = expandedId === log.id;
    const isDaily = log.type === 'daily';
    const statusColor = log.uploadStatus === 'uploaded'
      ? COLORS.success
      : log.uploadStatus === 'failed'
        ? COLORS.danger
        : COLORS.warning;

    return (
      <View key={log.id} style={[S.panel, isDaily ? undefined : styles.phasePanel]}>
        <TouchableOpacity onPress={() => setExpandedId(isExpanded ? null : log.id)} style={S.spaceBetween}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={styles.dateText}>
              {isDaily ? log.date : `Phase ${log.phaseNumber} Overall Log`}
            </Text>
            <Text style={S.subText}>
              {isDaily
                ? `Phase ${log.phaseNumber} Day ${log.phaseDay} · ${log.status}`
                : `${log.startDate} to ${log.endDate} · ${log.restDays} rest day(s)`}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.uploadBadge, { color: statusColor, borderColor: statusColor }]}>
              {uploadLabel(log.uploadStatus)}
            </Text>
            <Text style={styles.chevron}>{isExpanded ? 'UP' : 'OPEN'}</Text>
          </View>
        </TouchableOpacity>
        {isExpanded && (isDaily ? renderDailyDetails(log) : renderPhaseDetails(log))}
      </View>
    );
  };

  return (
    <SafeAreaView style={[S.screen, { flex: 1 }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.sysTag}>{'[ SYSTEM LOG ARCHIVE ]'}</Text>
        <Text style={S.titleText}>LOGS</Text>
        <Text style={S.subText}>Active phase daily logs and completed phase summaries</Text>

        {!hasLogs && (
          <View style={[S.center, styles.empty]}>
            <Text style={S.dimText}>No archived records found.</Text>
            <Text style={S.dimText}>Daily logs are created at rollover after midnight.</Text>
          </View>
        )}

        {activeDailyLogs.length > 0 && (
          <>
            <Text style={styles.sectionHeader}>ACTIVE PHASE DAILY LOGS</Text>
            {activeDailyLogs.map(renderLogCard)}
          </>
        )}

        {phaseLogs.length > 0 && (
          <>
            <Text style={styles.sectionHeader}>PHASE OVERALL LOGS</Text>
            {phaseLogs.map(renderLogCard)}
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={S.row}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  sysTag: { ...FONTS.mono, color: COLORS.cyanDim, fontSize: 10, letterSpacing: 3, marginBottom: 8 },
  sectionHeader: { ...FONTS.system, color: COLORS.cyanDim, fontSize: 10, letterSpacing: 2, marginTop: 18, marginBottom: 4 },
  dateText: { ...FONTS.title, color: COLORS.textPrimary, fontSize: 16 },
  phasePanel: { borderColor: COLORS.xp },
  uploadBadge: { ...FONTS.system, fontSize: 8, borderWidth: 1, paddingHorizontal: 6, paddingVertical: 2, marginBottom: 6 },
  chevron: { ...FONTS.system, color: COLORS.cyanDim, fontSize: 8 },
  details: { marginTop: 12 },
  divider: { height: 1, backgroundColor: COLORS.borderDim, marginVertical: 8 },
  detailTitle: { ...FONTS.system, color: COLORS.cyan, fontSize: 10, marginBottom: 4, letterSpacing: 1 },
  detailLabel: { ...FONTS.body, color: COLORS.textSub, fontSize: 12, width: 92 },
  detailValue: { ...FONTS.mono, color: COLORS.textPrimary, fontSize: 12, flex: 1 },
  detailLine: { ...FONTS.body, color: COLORS.textSub, fontSize: 11, lineHeight: 17 },
  empty: { minHeight: 240 },
});
