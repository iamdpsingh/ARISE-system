// ============================================================
// ARISE: The System — Mess-Based Nutrition Database
// ============================================================

export interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'drink' | 'supplement';
  servingLabel: string; // e.g. "1 bowl", "500 ml"
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  isWarm: boolean; // cold = flags allergy warning
  isCold: boolean;
}

export const FOOD_DB: FoodItem[] = [
  // ── BREAKFAST ──────────────────────────────────────────
  { id: 'poha', name: 'Poha', emoji: '🍚', category: 'breakfast', servingLabel: '1 plate', calories: 250, protein: 5, carbs: 46, fat: 4, isWarm: true, isCold: false },
  { id: 'upma', name: 'Upma', emoji: '🥘', category: 'breakfast', servingLabel: '1 plate', calories: 230, protein: 5, carbs: 40, fat: 5, isWarm: true, isCold: false },
  { id: 'dalia', name: 'Dalia (Broken Wheat)', emoji: '🌾', category: 'breakfast', servingLabel: '1 bowl', calories: 200, protein: 7, carbs: 38, fat: 2, isWarm: true, isCold: false },
  { id: 'paratha', name: 'Paratha (1 plain)', emoji: '🫓', category: 'breakfast', servingLabel: '1 paratha', calories: 180, protein: 4, carbs: 25, fat: 7, isWarm: true, isCold: false },
  { id: 'idli_2', name: 'Idli (×2)', emoji: '🫙', category: 'breakfast', servingLabel: '2 pieces', calories: 130, protein: 4, carbs: 28, fat: 0.5, isWarm: true, isCold: false },

  // ── LUNCH / DINNER ─────────────────────────────────────
  { id: 'roti_1', name: 'Roti (×1)', emoji: '🫓', category: 'lunch', servingLabel: '1 roti', calories: 100, protein: 3, carbs: 20, fat: 1, isWarm: true, isCold: false },
  { id: 'dal_bowl', name: 'Dal (1 bowl)', emoji: '🍲', category: 'lunch', servingLabel: '1 bowl', calories: 120, protein: 8, carbs: 18, fat: 2, isWarm: true, isCold: false },
  { id: 'sabzi_bowl', name: 'Sabzi (1 bowl)', emoji: '🥬', category: 'lunch', servingLabel: '1 bowl', calories: 80, protein: 2, carbs: 12, fat: 3, isWarm: true, isCold: false },
  { id: 'rice_bowl', name: 'Rice (1 bowl)', emoji: '🍚', category: 'lunch', servingLabel: '1 bowl', calories: 200, protein: 4, carbs: 44, fat: 0.5, isWarm: true, isCold: false },
  { id: 'paneer_100g', name: 'Paneer (100 g)', emoji: '🧀', category: 'lunch', servingLabel: '100 g', calories: 265, protein: 18, carbs: 3, fat: 20, isWarm: false, isCold: false },
  { id: 'rajma_bowl', name: 'Rajma (1 bowl)', emoji: '🫘', category: 'lunch', servingLabel: '1 bowl', calories: 130, protein: 10, carbs: 22, fat: 1, isWarm: true, isCold: false },
  { id: 'chole_bowl', name: 'Chole (1 bowl)', emoji: '🫘', category: 'lunch', servingLabel: '1 bowl', calories: 140, protein: 11, carbs: 23, fat: 2, isWarm: true, isCold: false },
  { id: 'soy_chunks_50g', name: 'Soy Chunks (50 g dry)', emoji: '🥩', category: 'lunch', servingLabel: '50 g', calories: 175, protein: 26, carbs: 12, fat: 1, isWarm: true, isCold: false },

  // ── SNACKS ─────────────────────────────────────────────
  { id: 'banana', name: 'Banana (1 medium)', emoji: '🍌', category: 'snack', servingLabel: '1 banana', calories: 90, protein: 1, carbs: 23, fat: 0.3, isWarm: false, isCold: false },
  { id: 'apple', name: 'Apple (1 medium)', emoji: '🍎', category: 'snack', servingLabel: '1 apple', calories: 80, protein: 0.5, carbs: 21, fat: 0.2, isWarm: false, isCold: false },
  { id: 'roasted_chana_50g', name: 'Roasted Chana (50 g)', emoji: '🌰', category: 'snack', servingLabel: '50 g', calories: 185, protein: 10, carbs: 28, fat: 3, isWarm: false, isCold: false },
  { id: 'peanuts_40g', name: 'Peanuts (40 g)', emoji: '🥜', category: 'snack', servingLabel: '40 g', calories: 232, protein: 10, carbs: 6, fat: 20, isWarm: false, isCold: false },
  { id: 'almonds_6', name: 'Soaked Almonds (×6)', emoji: '🌰', category: 'snack', servingLabel: '6 almonds', calories: 42, protein: 1.5, carbs: 1.5, fat: 3.5, isWarm: false, isCold: false },
  { id: 'peanut_butter_tbsp', name: 'Peanut Butter (1 tbsp)', emoji: '🥜', category: 'snack', servingLabel: '1 tbsp', calories: 95, protein: 4, carbs: 3, fat: 8, isWarm: false, isCold: false },
  { id: 'sattu_drink', name: 'Sattu Drink (30 g)', emoji: '🥤', category: 'snack', servingLabel: '30 g powder', calories: 110, protein: 8, carbs: 18, fat: 2, isWarm: false, isCold: false },

  // ── DRINKS ─────────────────────────────────────────────
  { id: 'milk_500ml', name: 'Milk (500 ml)', emoji: '🥛', category: 'drink', servingLabel: '500 ml', calories: 300, protein: 16, carbs: 24, fat: 11, isWarm: false, isCold: false },
  { id: 'curd_300g', name: 'Curd / Dahi (300 g)', emoji: '🥛', category: 'drink', servingLabel: '300 g', calories: 180, protein: 11, carbs: 12, fat: 9, isWarm: false, isCold: false },
  { id: 'buttermilk', name: 'Buttermilk / Chaas', emoji: '🥤', category: 'drink', servingLabel: '300 ml', calories: 45, protein: 3, carbs: 4, fat: 1, isWarm: false, isCold: false },
  { id: 'warm_water', name: 'Warm Water (1 glass)', emoji: '💧', category: 'drink', servingLabel: '1 glass (300 ml)', calories: 0, protein: 0, carbs: 0, fat: 0, isWarm: true, isCold: false },
  { id: 'haldi_milk', name: 'Haldi Milk', emoji: '🌕', category: 'drink', servingLabel: '1 glass', calories: 165, protein: 8, carbs: 13, fat: 6, isWarm: true, isCold: false },
  { id: 'ginger_tulsi_tea', name: 'Ginger-Tulsi Tea', emoji: '🍵', category: 'drink', servingLabel: '1 cup', calories: 10, protein: 0, carbs: 2, fat: 0, isWarm: true, isCold: false },
  { id: 'ghee_1tsp', name: 'Ghee (1 tsp)', emoji: '🧈', category: 'snack', servingLabel: '1 tsp', calories: 45, protein: 0, carbs: 0, fat: 5, isWarm: false, isCold: false },

  // ── COLD / AVOID ── (will trigger warning in UI)
  { id: 'cold_water', name: 'Cold Water ❌', emoji: '🧊', category: 'drink', servingLabel: '1 glass', calories: 0, protein: 0, carbs: 0, fat: 0, isWarm: false, isCold: true },
  { id: 'ice_cream', name: 'Ice Cream ❌', emoji: '🍦', category: 'snack', servingLabel: '1 scoop', calories: 200, protein: 3, carbs: 24, fat: 11, isWarm: false, isCold: true },
  { id: 'cold_milk_glass', name: 'Cold Milk ❌', emoji: '🥛', category: 'drink', servingLabel: '1 glass', calories: 150, protein: 8, carbs: 12, fat: 5, isWarm: false, isCold: true },
  { id: 'packaged_snack', name: 'Packaged Snack ❌', emoji: '🍟', category: 'snack', servingLabel: '1 packet', calories: 400, protein: 4, carbs: 55, fat: 18, isWarm: false, isCold: false },
];

// Phase-specific calorie + protein targets
export const PHASE_NUTRITION: Record<number, { cal: string; protein: string }> = {
  0: { cal: '2,200–2,350', protein: '80–90 g' },
  1: { cal: '2,450–2,650', protein: '100–115 g' },
  2: { cal: '2,550–2,850', protein: '110–125 g' },
  3: { cal: '2,600–2,900', protein: '115–130 g' },
  4: { cal: '2,600–2,900', protein: '120–130 g' },
  5: { cal: '2,650–2,950', protein: '125–135 g' },
  6: { cal: '2,650–2,950', protein: '125–135 g' },
  7: { cal: '2,700–3,000', protein: '130–140 g' },
  8: { cal: '2,800–3,100', protein: '135–145 g' },
  9: { cal: '2,900–3,200', protein: '140–150 g' },
  10: { cal: '2,800–3,200', protein: '140–155 g' },
  11: { cal: '2,850–3,250', protein: '145–160 g' },
  12: { cal: '2,900–3,300', protein: '150–165 g' },
  13: { cal: '3,000–3,400', protein: '155–170 g' },
  14: { cal: '3,100–3,500', protein: '160–175 g' },
  15: { cal: '3,200–3,600', protein: '165–180 g' },
  16: { cal: '3,200–3,600', protein: '165–180 g' },
  17: { cal: '3,200–3,600', protein: '165–180 g' },
  18: { cal: '3,200–3,600', protein: '165–180 g' },
};

export const MESS_MEAL_PRESETS = {
  breakfast: ['poha', 'upma', 'dalia', 'paratha', 'idli_2'],
  lunch: ['roti_1', 'dal_bowl', 'sabzi_bowl', 'rice_bowl', 'paneer_100g', 'rajma_bowl', 'chole_bowl', 'curd_300g'],
  dinner: ['roti_1', 'dal_bowl', 'sabzi_bowl', 'paneer_100g', 'rajma_bowl', 'chole_bowl', 'soy_chunks_50g'],
  snack: ['banana', 'apple', 'roasted_chana_50g', 'peanuts_40g', 'almonds_6', 'sattu_drink', 'peanut_butter_tbsp'],
  drink: ['milk_500ml', 'curd_300g', 'buttermilk', 'warm_water', 'haldi_milk', 'ginger_tulsi_tea', 'ghee_1tsp'],
};
