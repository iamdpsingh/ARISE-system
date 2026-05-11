import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, S, FONTS } from '../theme/theme';
import type { PlayerState, DailyState } from '../hooks/usePlayerState';

interface Props {
  state: PlayerState;
}

export default function HistoryScreen({ state }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const renderItem = ({ item }: { item: DailyState }) => {
    const isExpanded = expandedId === item.date;
    const routineCount = [
      item.breathingDone,
      item.steamDone,
      item.sunlightDone,
      item.walkDone,
    ].filter(Boolean).length;
    
    const isPerfect = routineCount === 4 && item.waterMl >= item.targetWaterMl;

    return (
      <View style={[S.panel, isPerfect && { borderColor: COLORS.success }]}>
        <TouchableOpacity 
          onPress={() => setExpandedId(isExpanded ? null : item.date)}
          style={S.spaceBetween}
        >
          <View>
            <Text style={styles.dateText}>{item.date}</Text>
            <Text style={S.subText}>{routineCount}/4 Routine · {(item.waterMl/1000).toFixed(1)}L Water</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            {isPerfect && <Text style={styles.perfectBadge}>PERFECT</Text>}
            <Text style={styles.chevron}>{isExpanded ? '▲' : '▼'}</Text>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.details}>
            <View style={styles.divider} />
            <Text style={styles.detailTitle}>[ MISSION RECORDS ]</Text>
            
            <View style={S.row}>
              <Text style={styles.detailLabel}>Energy Level:</Text>
              <Text style={styles.detailValue}>{'★'.repeat(item.energyLevel)}</Text>
            </View>
            <View style={S.row}>
              <Text style={styles.detailLabel}>Symptoms:</Text>
              <Text style={[styles.detailValue, { color: item.symptomsLog === 'ok' ? COLORS.success : COLORS.danger }]}>
                {item.symptomsLog.toUpperCase()}
              </Text>
            </View>
            <View style={S.row}>
              <Text style={styles.detailLabel}>Sleep:</Text>
              <Text style={styles.detailValue}>{item.sleepHours} Hours</Text>
            </View>
            <View style={S.row}>
              <Text style={styles.detailLabel}>XP Gained:</Text>
              <Text style={[styles.detailValue, { color: COLORS.xp }]}>+{item.xpEarnedToday} XP</Text>
            </View>

            <Text style={[styles.detailTitle, { marginTop: 12 }]}>[ NUTRITION SUMMARY ]</Text>
            <Text style={S.dimText}>
              {item.meals.length} Meals logged. Total: {item.meals.reduce((s, m) => s + m.calories, 0)} kcal.
            </Text>
            {item.meals.map((m, i) => (
              <Text key={i} style={styles.mealItem}>• {m.name} ({m.calories} kcal)</Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[S.screen, { flex: 1 }]} edges={['top']}>
      <View style={styles.container}>
        <Text style={styles.sysTag}>{'[ SYSTEM LOG ARCHIVE ]'}</Text>
        <Text style={S.titleText}>PAST MISSIONS</Text>
        <Text style={S.subText}>Synchronized with Local Data & GitHub</Text>

        {state.history.length === 0 ? (
          <View style={[S.center, { flex: 1 }]}>
            <Text style={S.dimText}>No archived records found.</Text>
            <Text style={S.dimText}>Complete a daily quest to begin logging.</Text>
          </View>
        ) : (
          <FlatList
            data={state.history}
            renderItem={renderItem}
            keyExtractor={item => item.date}
            contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  sysTag: { ...FONTS.mono, color: COLORS.cyanDim, fontSize: 10, letterSpacing: 3, marginBottom: 8 },
  dateText: { ...FONTS.title, color: COLORS.textPrimary, fontSize: 16 },
  perfectBadge: { ...FONTS.system, color: COLORS.success, fontSize: 9, letterSpacing: 1 },
  chevron: { color: COLORS.cyanDim, fontSize: 12, marginTop: 4 },
  details: { marginTop: 12 },
  divider: { height: 1, backgroundColor: COLORS.borderDim, marginVertical: 8 },
  detailTitle: { ...FONTS.system, color: COLORS.cyan, fontSize: 10, marginBottom: 4, letterSpacing: 1 },
  detailLabel: { ...FONTS.body, color: COLORS.textSub, fontSize: 12, width: 100 },
  detailValue: { ...FONTS.mono, color: COLORS.textPrimary, fontSize: 12 },
  mealItem: { ...FONTS.body, color: COLORS.textSub, fontSize: 11, marginLeft: 8, marginTop: 2 },
});
