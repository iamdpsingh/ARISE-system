import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, S, FONTS } from '../theme/theme';
import { WaterOrb } from '../components/UIComponents';
import { FOOD_DB, MESS_MEAL_PRESETS, PHASE_NUTRITION } from '../data/nutrition';
import type { PlayerState, MealLog } from '../hooks/usePlayerState';

interface Props {
  state: PlayerState;
  todayCalories: number;
  todayProtein: number;
  waterPercent: number;
  onAddWater: (ml: number) => void;
  onLogMeal: (meal: MealLog) => void;
  onRemoveMeal: (id: string) => void;
}

type MealTime = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'drink';

const MEAL_TIMES: { key: MealTime; label: string; emoji: string }[] = [
  { key: 'breakfast', label: 'BREAKFAST', emoji: '🌅' },
  { key: 'lunch', label: 'LUNCH', emoji: '☀️' },
  { key: 'dinner', label: 'DINNER', emoji: '🌙' },
  { key: 'snack', label: 'SNACK', emoji: '🌰' },
  { key: 'drink', label: 'DRINK', emoji: '💧' },
];

const WATER_AMOUNTS = [200, 300, 500];

export default function NutritionScreen({
  state, todayCalories, todayProtein, waterPercent,
  onAddWater, onLogMeal, onRemoveMeal
}: Props) {
  const [activeMealTab, setActiveMealTab] = useState<MealTime>('breakfast');
  const phase = state.currentPhase;
  const targets = PHASE_NUTRITION[phase];
  const calorieMin = parseInt(targets.cal.replace(/[^0-9]/g, '').slice(0, 4));
  const proteinTarget = parseInt(targets.protein.replace(/[^0-9].*/, ''));
  const calPercent = Math.min(100, (todayCalories / calorieMin) * 100);
  const proteinPercent = Math.min(100, (todayProtein / proteinTarget) * 100);

  const foodsForTab = (MESS_MEAL_PRESETS[activeMealTab] || [])
    .map(id => FOOD_DB.find(f => f.id === id))
    .filter(Boolean) as typeof FOOD_DB;

  const addFood = (food: typeof FOOD_DB[0]) => {
    if (food.isCold) {
      Alert.alert('⚠ System Warning', `"${food.name}" is cold and may trigger your allergy/gut issues. Avoid this.\n\nDrink warm or room-temperature fluids instead.`, [{ text: 'Understood', style: 'cancel' }]);
      return;
    }
    const meal: MealLog = {
      id: `${Date.now()}`,
      foodId: food.id,
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      timestamp: new Date().toISOString(),
    };
    onLogMeal(meal);
  };

  return (
    <SafeAreaView style={[S.screen, { flex: 1 }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sysTag}>{'[ NUTRITION SYSTEM ]'}</Text>

        {/* ── WATER ────────────────────────────────── */}
        <View style={S.panel}>
          <Text style={S.sectionTitle}>Water Intake</Text>
          <WaterOrb waterMl={state.today.waterMl} targetMl={state.today.targetWaterMl} />
          <View style={styles.waterBtns}>
            {WATER_AMOUNTS.map(ml => (
              <TouchableOpacity key={ml} style={S.glowBtn} onPress={() => onAddWater(ml)}>
                <Text style={S.glowBtnText}>+{ml} ml</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.waterTip}>
            ⚠ Always warm water. Cold water = allergy trigger. Target: {(state.today.targetWaterMl / 1000).toFixed(1)} L/day
          </Text>
        </View>

        {/* ── DAILY TARGETS ─────────────────────────── */}
        <View style={S.panel}>
          <Text style={S.sectionTitle}>Phase {phase} Targets</Text>

          <View style={styles.targetRow}>
            <View style={{ flex: 1 }}>
              <View style={S.spaceBetween}>
                <Text style={styles.macroLabel}>CALORIES</Text>
                <Text style={[styles.macroValue, { color: COLORS.xp }]}>{todayCalories} / {targets.cal} kcal</Text>
              </View>
              <View style={[S.barContainer, { marginTop: 4 }]}>
                <View style={[S.barFill, { width: `${calPercent}%`, backgroundColor: COLORS.xp }]} />
              </View>
            </View>
          </View>

          <View style={[styles.targetRow, { marginTop: 10 }]}>
            <View style={{ flex: 1 }}>
              <View style={S.spaceBetween}>
                <Text style={styles.macroLabel}>PROTEIN</Text>
                <Text style={[styles.macroValue, { color: COLORS.success }]}>{todayProtein}g / {targets.protein}</Text>
              </View>
              <View style={[S.barContainer, { marginTop: 4 }]}>
                <View style={[S.barFill, { width: `${proteinPercent}%`, backgroundColor: COLORS.success }]} />
              </View>
            </View>
          </View>
        </View>

        {/* ── FOOD LOG ─────────────────────────────── */}
        <View style={S.panel}>
          <Text style={S.sectionTitle}>Today's Meals</Text>
          {state.today.meals.length === 0 ? (
            <Text style={S.subText}>No meals logged yet.</Text>
          ) : (
            state.today.meals.map(m => (
              <View key={m.id} style={styles.mealLogRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.mealLogName}>{m.name}</Text>
                  <Text style={S.subText}>{m.calories} kcal · {m.protein}g protein</Text>
                </View>
                <TouchableOpacity onPress={() => onRemoveMeal(m.id)}>
                  <Text style={styles.removeBtn}>✕</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* ── ADD FOOD ─────────────────────────────── */}
        <View style={S.panel}>
          <Text style={S.sectionTitle}>Log Meal</Text>

          {/* Meal time tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
            {MEAL_TIMES.map(mt => (
              <TouchableOpacity
                key={mt.key}
                onPress={() => setActiveMealTab(mt.key)}
                style={[styles.tab, activeMealTab === mt.key && styles.tabActive]}
              >
                <Text style={styles.tabEmoji}>{mt.emoji}</Text>
                <Text style={[styles.tabLabel, activeMealTab === mt.key && { color: COLORS.cyan }]}>{mt.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.foodGrid}>
            {foodsForTab.map(food => (
              <TouchableOpacity
                key={food.id}
                style={[styles.foodCard, food.isCold && styles.foodCardCold]}
                onPress={() => addFood(food)}
              >
                <Text style={styles.foodEmoji}>{food.emoji}</Text>
                <Text style={styles.foodName} numberOfLines={2}>{food.name}</Text>
                <Text style={styles.foodMacro}>{food.protein}g P · {food.calories}kcal</Text>
                {food.isCold && <Text style={styles.coldWarn}>❌ COLD</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── PROTEIN REFERENCE ─────────────────────── */}
        <View style={S.panel}>
          <Text style={S.sectionTitle}>Protein Quick Reference</Text>
          {[
            { food: '500 ml Milk', protein: '16–17 g' },
            { food: '300 g Curd', protein: '10–12 g' },
            { food: '2 bowls Dal', protein: '14–18 g' },
            { food: '100 g Paneer', protein: '18–20 g' },
            { food: '50 g Roasted Chana', protein: '9–10 g' },
            { food: '50 g Soy Chunks (dry)', protein: '24–26 g' },
            { food: '1 bowl Rajma/Chole', protein: '8–12 g' },
          ].map(r => (
            <View key={r.food} style={styles.refRow}>
              <Text style={S.bodyText}>{r.food}</Text>
              <Text style={[S.bodyText, { color: COLORS.success }]}>{r.protein}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16 },
  sysTag: { ...FONTS.mono, color: COLORS.cyanDim, fontSize: 10, letterSpacing: 3, marginBottom: 12 },
  waterBtns: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 12, gap: 8 },
  waterTip: { ...FONTS.body, color: COLORS.warning, fontSize: 11, marginTop: 10, fontStyle: 'italic' },
  targetRow: {},
  macroLabel: { ...FONTS.system, color: COLORS.textSub, fontSize: 10, letterSpacing: 2 },
  macroValue: { ...FONTS.mono, fontSize: 12 },
  mealLogRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.borderDim },
  mealLogName: { ...FONTS.body, color: COLORS.textPrimary, fontSize: 14 },
  removeBtn: { color: COLORS.danger, fontSize: 16, paddingHorizontal: 8 },
  tabScroll: { marginBottom: 12 },
  tab: { paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: COLORS.borderDim, marginRight: 8, alignItems: 'center' },
  tabActive: { borderColor: COLORS.cyan, backgroundColor: COLORS.cyanGlow },
  tabEmoji: { fontSize: 18 },
  tabLabel: { ...FONTS.system, color: COLORS.textSub, fontSize: 9, letterSpacing: 1, marginTop: 2 },
  foodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  foodCard: { width: '31%', backgroundColor: 'rgba(0,20,55,0.6)', borderWidth: 1, borderColor: COLORS.borderDim, padding: 10, alignItems: 'center', borderRadius: 4 },
  foodCardCold: { borderColor: COLORS.danger, backgroundColor: 'rgba(80,0,0,0.2)' },
  foodEmoji: { fontSize: 24, marginBottom: 4 },
  foodName: { ...FONTS.body, color: COLORS.textPrimary, fontSize: 11, textAlign: 'center', marginBottom: 2 },
  foodMacro: { ...FONTS.mono, color: COLORS.textSub, fontSize: 10 },
  coldWarn: { ...FONTS.system, color: COLORS.danger, fontSize: 9, marginTop: 2 },
  refRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.borderDim },
});
