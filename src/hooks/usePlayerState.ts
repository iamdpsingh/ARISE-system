// ============================================================
// ARISE: The System — Player State Hook (Core Game Engine)
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DAILY_TIMETABLE, TimeBlock } from '../data/timetable';

export type StatKey = 'strength' | 'agility' | 'sense' | 'vitality' | 'intelligence';

export interface PlayerStats {
  strength: number;
  agility: number;
  sense: number;
  vitality: number;
  intelligence: number;
}

export type SystemRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'National' | 'Shadow Monarch';

export interface MealLog {
  id: string;
  foodId: string;
  name: string;
  calories: number;
  protein: number;
  timestamp: string;
}

export interface QuestCompletion {
  exerciseId: string;
  completed: boolean;
}

export interface DailyState {
  date: string;
  waterMl: number;
  targetWaterMl: number;
  meals: MealLog[];
  questsCompleted: Record<string, boolean>;
  breathingDone: boolean;
  steamDone: boolean;
  sunlightDone: boolean;
  walkDone: boolean;
  sleepHours: number;
  energyLevel: number; // 1–5
  symptomsLog: 'ok' | 'mild' | 'bad';
  xpEarnedToday: number;
  allDailyCompleted: boolean;
}

export interface PlayerState {
  // Identity
  name: string;
  setupComplete: boolean;

  // Progress
  level: number;
  xp: number;
  maxXp: number;
  currentPhase: number;
  completedPhases: number[];
  totalDaysCompleted: number;
  streakDays: number;
  lastActiveDate: string;
  shadowCount: number; // completed weeks

  // Stats
  stats: PlayerStats;
  statPoints: number;
  rank: SystemRank;
  title: string;

  // Daily
  today: DailyState;

  // History
  weeklyXp: number[];  // last 7 days
  history: DailyState[]; // last 30 days
  githubConfig: { token: string; repo: string; owner: string } | null;
  timetable: TimeBlock[];
}

const RANK_LEVELS: { level: number; rank: SystemRank; title: string }[] = [
  { level: 1,  rank: 'E', title: 'The Weakest' },
  { level: 5,  rank: 'E', title: 'Preparation Beginner' },
  { level: 10, rank: 'D', title: 'Consistent Hunter' },
  { level: 15, rank: 'D', title: 'Iron Resolve' },
  { level: 20, rank: 'C', title: 'Iron Body' },
  { level: 30, rank: 'B', title: 'Athletic Fighter' },
  { level: 40, rank: 'A', title: 'Elite Physique' },
  { level: 50, rank: 'S', title: 'Shadow General' },
  { level: 70, rank: 'National', title: 'National Level Hunter' },
  { level: 100, rank: 'Shadow Monarch', title: 'I Am The Shadow Monarch' },
];

const XP_FOR_LEVEL = (level: number) => Math.floor(100 * Math.pow(1.4, level - 1));

const todayStr = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const INITIAL_TODAY = (): DailyState => ({
  date: todayStr(),
  waterMl: 0,
  targetWaterMl: 2750,
  meals: [],
  questsCompleted: {},
  breathingDone: false,
  steamDone: false,
  sunlightDone: false,
  walkDone: false,
  sleepHours: 0,
  energyLevel: 3,
  symptomsLog: 'ok',
  xpEarnedToday: 0,
  allDailyCompleted: false,
});

const INITIAL_STATE: PlayerState = {
  name: '',
  setupComplete: false,
  level: 1,
  xp: 0,
  maxXp: 100,
  currentPhase: 0,
  completedPhases: [],
  totalDaysCompleted: 0,
  streakDays: 0,
  lastActiveDate: '',
  shadowCount: 0,
  stats: {
    strength: 5,
    agility: 5,
    sense: 5,
    vitality: 5,
    intelligence: 5,
  },
  statPoints: 0,
  rank: 'E',
  title: 'The Weakest',
  today: INITIAL_TODAY(),
  weeklyXp: [0, 0, 0, 0, 0, 0, 0],
  history: [],
  githubConfig: null,
  timetable: DAILY_TIMETABLE,
};

const STORAGE_KEY = 'arise_player_v2';

export const usePlayerState = () => {
  const [state, setState] = useState<PlayerState>(INITIAL_STATE);
  const [loaded, setLoaded] = useState(false);

  // Load from storage on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        // Merge with INITIAL_STATE to handle migration for new fields
        const parsed: PlayerState = { ...INITIAL_STATE, ...JSON.parse(raw) };
        
        // Ensure sub-objects also exist
        if (!parsed.history) parsed.history = [];
        if (!parsed.today) parsed.today = INITIAL_TODAY();
        parsed.today = { ...INITIAL_TODAY(), ...parsed.today };
        if (!parsed.timetable || !Array.isArray(parsed.timetable) || parsed.timetable.length === 0) {
          parsed.timetable = DAILY_TIMETABLE;
        }
        
        const today = todayStr();

        // Daily reset if new day
        if (parsed.today.date !== today) {
          parsed.today = INITIAL_TODAY();
        }
        setState(parsed);
      }
      setLoaded(true);
    });
  }, []);

  // Persist on state change
  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, loaded]);

  const getRankAndTitle = useCallback((level: number): { rank: SystemRank; title: string } => {
    let result = { rank: 'E' as SystemRank, title: 'The Weakest' };
    for (const entry of RANK_LEVELS) {
      if (level >= entry.level) result = { rank: entry.rank, title: entry.title };
    }
    return result;
  }, []);

  const addXp = useCallback((amount: number): { leveledUp: boolean; newLevel: number } => {
    let leveledUp = false;
    let newLevelOut = 1;

    setState(prev => {
      let xp = prev.xp + amount;
      let level = prev.level;
      let maxXp = prev.maxXp;
      let statPoints = prev.statPoints;
      let newShadows = prev.shadowCount;

      while (xp >= maxXp) {
        xp -= maxXp;
        level++;
        maxXp = XP_FOR_LEVEL(level);
        statPoints += 5;
        leveledUp = true;
        newLevelOut = level;
      }

      const { rank, title } = getRankAndTitle(level);
      const weeklyXp = [...prev.weeklyXp];
      weeklyXp[6] = (weeklyXp[6] || 0) + amount;

      return {
        ...prev,
        xp,
        level,
        maxXp,
        statPoints,
        rank,
        title,
        shadowCount: newShadows,
        weeklyXp,
        today: {
          ...prev.today,
          xpEarnedToday: prev.today.xpEarnedToday + amount,
        },
      };
    });

    return { leveledUp, newLevel: newLevelOut };
  }, [getRankAndTitle]);

  const allocateStat = useCallback((stat: StatKey) => {
    setState(prev => {
      if (prev.statPoints <= 0) return prev;
      return {
        ...prev,
        statPoints: prev.statPoints - 1,
        stats: { ...prev.stats, [stat]: prev.stats[stat] + 1 },
      };
    });
  }, []);

  const addWater = useCallback((ml: number) => {
    setState(prev => ({
      ...prev,
      today: { ...prev.today, waterMl: Math.min(prev.today.waterMl + ml, 5000) },
    }));
  }, []);

  const logMeal = useCallback((meal: MealLog) => {
    setState(prev => ({
      ...prev,
      today: { ...prev.today, meals: [...prev.today.meals, meal] },
    }));
  }, []);

  const removeMeal = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      today: { ...prev.today, meals: prev.today.meals.filter(m => m.id !== id) },
    }));
  }, []);

  const completeQuest = useCallback((questId: string, xpReward: number) => {
    let shouldAwardXp = false;

    setState(prev => {
      if (prev.today.questsCompleted[questId]) return prev;
      shouldAwardXp = true;
      return {
        ...prev,
        today: {
          ...prev.today,
          questsCompleted: { ...prev.today.questsCompleted, [questId]: true },
        },
      };
    });

    if (shouldAwardXp) addXp(xpReward);
  }, [addXp]);

  const markRoutine = useCallback((key: 'breathingDone' | 'steamDone' | 'sunlightDone' | 'walkDone') => {
    let shouldAwardXp = false;

    setState(prev => {
      if (prev.today[key]) return prev;
      shouldAwardXp = true;
      return { ...prev, today: { ...prev.today, [key]: true } };
    });

    if (shouldAwardXp) addXp(25);
  }, [addXp]);

  const logSleep = useCallback((hours: number) => {
    let shouldAwardXp = false;

    setState(prev => {
      if (prev.today.sleepHours < 7 && hours >= 7) shouldAwardXp = true;
      return { ...prev, today: { ...prev.today, sleepHours: hours } };
    });

    if (shouldAwardXp) addXp(30);
  }, [addXp]);

  const logEnergy = useCallback((level: number) => {
    setState(prev => ({ ...prev, today: { ...prev.today, energyLevel: level } }));
  }, []);

  const logSymptoms = useCallback((val: 'ok' | 'mild' | 'bad') => {
    setState(prev => ({ ...prev, today: { ...prev.today, symptomsLog: val } }));
  }, []);

  const completeDailyAll = useCallback(() => {
    let shouldAwardXp = false;

    setState(prev => {
      if (prev.today.allDailyCompleted) return prev;

      const today = todayStr();
      const totalDaysCompleted = prev.totalDaysCompleted + 1;
      const shadows = Math.floor(totalDaysCompleted / 7);

      // Archive today into history (limit to 30 days)
      const newHistory = [prev.today, ...prev.history].slice(0, 30);
      shouldAwardXp = true;

      return {
        ...prev,
        totalDaysCompleted,
        streakDays: prev.streakDays + 1,
        lastActiveDate: today,
        shadowCount: shadows,
        history: newHistory,
        today: { ...prev.today, allDailyCompleted: true },
      };
    });

    if (shouldAwardXp) addXp(200);
  }, [addXp]);

  const setName = useCallback((name: string) => {
    setState(prev => ({ ...prev, name, setupComplete: true }));
  }, []);

  const advancePhase = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentPhase: Math.min(prev.currentPhase + 1, 18),
      completedPhases: [...prev.completedPhases, prev.currentPhase],
    }));
    addXp(500);
  }, [addXp]);

  const resetState = useCallback(() => {
    AsyncStorage.removeItem(STORAGE_KEY).then(() => {
      setState(INITIAL_STATE);
    });
  }, []);

  // Computed helpers
  const todayCalories = state.today.meals.reduce((s, m) => s + m.calories, 0);
  const todayProtein = state.today.meals.reduce((s, m) => s + m.protein, 0);
  const waterPercent = Math.min(100, (state.today.waterMl / state.today.targetWaterMl) * 100);
  const xpPercent = Math.min(100, (state.xp / state.maxXp) * 100);
  const routinesDone = [
    state.today.breathingDone,
    state.today.steamDone,
    state.today.sunlightDone,
    state.today.walkDone,
  ].filter(Boolean).length;

  return {
    state,
    loaded,
    // Actions
    addXp,
    allocateStat,
    addWater,
    logMeal,
    removeMeal,
    completeQuest,
    markRoutine,
    logSleep,
    logEnergy,
    logSymptoms,
    completeDailyAll,
    setName,
    advancePhase,
    resetState,
    setGithubConfig: (config: PlayerState['githubConfig']) => setState(p => ({ ...p, githubConfig: config })),
    clearGithubConfig: () => setState(p => ({ ...p, githubConfig: null })),
    setTimetable: (timetable: TimeBlock[]) => setState(p => ({ ...p, timetable: timetable.map(item => ({ ...item })) })),
    resetTimetable: () => setState(p => ({ ...p, timetable: DAILY_TIMETABLE.map(item => ({ ...item })) })),
    // Computed
    todayCalories,
    todayProtein,
    waterPercent,
    xpPercent,
    routinesDone,
  };
};
