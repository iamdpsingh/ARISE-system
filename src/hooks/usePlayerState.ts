// ============================================================
// ARISE: The System — Player State Hook (Core Game Engine)
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DAILY_TIMETABLE, TimeBlock } from '../data/timetable';
import type {
  DailyLogEntry,
  PhaseLogEntry,
  UploadQueueItem,
} from '../services/dailyLogService';
import {
  completeCurrentPhaseNow,
  createDailyState,
  creditStreakForDate,
  getCurrentAppDay,
  getPhaseDayForState,
  hasMeaningfulActivity,
  localDateString,
  normalizeDailyState,
  rollOverPlayerState,
  sanitizeGithubConfig,
  sanitizePlayerStateForStorage,
} from '../services/dailyLogService';
import { deleteGithubToken, saveGithubToken } from '../services/secureConfig';
import { uploadPendingLogItems } from '../services/githubService';
import type { UploadPendingResult } from '../services/githubService';

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
  restDay: boolean;
  restDayMarkedAt?: string;
  streakCredited: boolean;
}

export interface GithubConfig {
  token?: string;
  repo: string;
  owner: string;
  tokenConfigured?: boolean;
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
  currentPhaseDay: number;
  phaseStartedAt: string;
  streakDays: number;
  lastActiveDate: string;
  lastStreakDate: string;
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
  history: DailyState[]; // legacy archive kept for migration compatibility
  dailyLogs: DailyLogEntry[];
  phaseLogs: PhaseLogEntry[];
  uploadQueue: UploadQueueItem[];
  githubConfig: GithubConfig | null;
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

const todayStr = localDateString;

const INITIAL_TODAY = (): DailyState => createDailyState(todayStr());

const INITIAL_STATE: PlayerState = {
  name: '',
  setupComplete: false,
  level: 1,
  xp: 0,
  maxXp: 100,
  currentPhase: 0,
  completedPhases: [],
  totalDaysCompleted: 0,
  currentPhaseDay: 1,
  phaseStartedAt: todayStr(),
  streakDays: 0,
  lastActiveDate: '',
  lastStreakDate: '',
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
  dailyLogs: [],
  phaseLogs: [],
  uploadQueue: [],
  githubConfig: null,
  timetable: DAILY_TIMETABLE,
};

export const STORAGE_KEY = 'arise_player_v2';

const prepareStateForToday = (state: PlayerState): PlayerState => rollOverPlayerState(state).state;

const markMeaningfulActivityForToday = (state: PlayerState): PlayerState => {
  const prepared = prepareStateForToday(state);
  const today = normalizeDailyState(prepared.today, todayStr());
  if (today.streakCredited || !hasMeaningfulActivity(today)) return { ...prepared, today };

  const credited = creditStreakForDate(prepared, today.date);
  return {
    ...credited,
    today: { ...today, streakCredited: true },
  };
};

export const usePlayerState = () => {
  const [state, setState] = useState<PlayerState>(INITIAL_STATE);
  const [loaded, setLoaded] = useState(false);
  const stateRef = useRef<PlayerState>(INITIAL_STATE);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Load from storage on mount
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const stored = JSON.parse(raw);
          const migratedToken = stored?.githubConfig?.token;
          if (migratedToken) {
            await saveGithubToken(migratedToken);
          }

          const parsed: PlayerState = {
            ...INITIAL_STATE,
            ...stored,
            today: normalizeDailyState(stored.today, todayStr()),
            githubConfig: sanitizeGithubConfig({
              ...stored.githubConfig,
              tokenConfigured: Boolean(stored.githubConfig?.tokenConfigured || migratedToken),
            }),
            dailyLogs: Array.isArray(stored.dailyLogs) ? stored.dailyLogs : [],
            phaseLogs: Array.isArray(stored.phaseLogs) ? stored.phaseLogs : [],
            uploadQueue: Array.isArray(stored.uploadQueue) ? stored.uploadQueue : [],
            history: Array.isArray(stored.history) ? stored.history : [],
            timetable: Array.isArray(stored.timetable) && stored.timetable.length > 0 ? stored.timetable : DAILY_TIMETABLE,
            currentPhaseDay: stored.currentPhaseDay || 1,
            phaseStartedAt: stored.phaseStartedAt || todayStr(),
            lastStreakDate: stored.lastStreakDate || stored.lastActiveDate || '',
          };

          const rolled = rollOverPlayerState(parsed);
          if (mounted) {
            stateRef.current = rolled.state;
            setState(rolled.state);
          }
        }
      } catch (error) {
        console.log('Failed to load ARISE state:', error);
      } finally {
        if (mounted) setLoaded(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Persist on state change
  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizePlayerStateForStorage(state)));
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
      const current = prepareStateForToday(prev);
      let xp = current.xp + amount;
      let level = current.level;
      let maxXp = current.maxXp;
      let statPoints = current.statPoints;
      let newShadows = current.shadowCount;

      while (xp >= maxXp) {
        xp -= maxXp;
        level++;
        maxXp = XP_FOR_LEVEL(level);
        statPoints += 5;
        leveledUp = true;
        newLevelOut = level;
      }

      const { rank, title } = getRankAndTitle(level);
      const weeklyXp = [...current.weeklyXp];
      weeklyXp[6] = (weeklyXp[6] || 0) + amount;

      return {
        ...current,
        xp,
        level,
        maxXp,
        statPoints,
        rank,
        title,
        shadowCount: newShadows,
        weeklyXp,
        today: {
          ...current.today,
          xpEarnedToday: current.today.xpEarnedToday + amount,
        },
      };
    });

    return { leveledUp, newLevel: newLevelOut };
  }, [getRankAndTitle]);

  const allocateStat = useCallback((stat: StatKey) => {
    setState(prev => {
      const current = prepareStateForToday(prev);
      if (current.statPoints <= 0) return current;
      return {
        ...current,
        statPoints: current.statPoints - 1,
        stats: { ...current.stats, [stat]: current.stats[stat] + 1 },
      };
    });
  }, []);

  const addWater = useCallback((ml: number) => {
    setState(prev => {
      const current = prepareStateForToday(prev);
      return markMeaningfulActivityForToday({
        ...current,
        today: { ...current.today, waterMl: Math.min(current.today.waterMl + ml, 5000) },
      });
    });
  }, []);

  const logMeal = useCallback((meal: MealLog) => {
    setState(prev => {
      const current = prepareStateForToday(prev);
      return markMeaningfulActivityForToday({
        ...current,
        today: { ...current.today, meals: [...current.today.meals, meal] },
      });
    });
  }, []);

  const removeMeal = useCallback((id: string) => {
    setState(prev => {
      const current = prepareStateForToday(prev);
      return {
        ...current,
        today: { ...current.today, meals: current.today.meals.filter(m => m.id !== id) },
      };
    });
  }, []);

  const completeQuest = useCallback((questId: string, xpReward: number) => {
    let shouldAwardXp = false;

    setState(prev => {
      const current = prepareStateForToday(prev);
      if (current.today.questsCompleted[questId]) return current;
      shouldAwardXp = true;
      return markMeaningfulActivityForToday({
        ...current,
        today: {
          ...current.today,
          questsCompleted: { ...current.today.questsCompleted, [questId]: true },
        },
      });
    });

    if (shouldAwardXp) addXp(xpReward);
  }, [addXp]);

  const markRoutine = useCallback((key: 'breathingDone' | 'steamDone' | 'sunlightDone' | 'walkDone') => {
    let shouldAwardXp = false;

    setState(prev => {
      const current = prepareStateForToday(prev);
      if (current.today[key]) return current;
      shouldAwardXp = true;
      return markMeaningfulActivityForToday({ ...current, today: { ...current.today, [key]: true } });
    });

    if (shouldAwardXp) addXp(25);
  }, [addXp]);

  const logSleep = useCallback((hours: number) => {
    let shouldAwardXp = false;

    setState(prev => {
      const current = prepareStateForToday(prev);
      if (current.today.sleepHours < 7 && hours >= 7) shouldAwardXp = true;
      return markMeaningfulActivityForToday({ ...current, today: { ...current.today, sleepHours: hours } });
    });

    if (shouldAwardXp) addXp(30);
  }, [addXp]);

  const logEnergy = useCallback((level: number) => {
    setState(prev => {
      const current = prepareStateForToday(prev);
      return { ...current, today: { ...current.today, energyLevel: level } };
    });
  }, []);

  const logSymptoms = useCallback((val: 'ok' | 'mild' | 'bad') => {
    setState(prev => {
      const current = prepareStateForToday(prev);
      return { ...current, today: { ...current.today, symptomsLog: val } };
    });
  }, []);

  const completeDailyAll = useCallback(() => {
    let shouldAwardXp = false;

    setState(prev => {
      const current = prepareStateForToday(prev);
      if (current.today.allDailyCompleted) return current;
      shouldAwardXp = true;
      return markMeaningfulActivityForToday({
        ...current,
        today: { ...current.today, allDailyCompleted: true },
      });
    });

    if (shouldAwardXp) addXp(200);
  }, [addXp]);

  const markRestDay = useCallback(() => {
    setState(prev => {
      const current = prepareStateForToday(prev);
      if (current.today.restDay) return current;
      return markMeaningfulActivityForToday({
        ...current,
        today: {
          ...current.today,
          restDay: true,
          restDayMarkedAt: new Date().toISOString(),
        },
      });
    });
  }, []);

  const setName = useCallback((name: string) => {
    setState(prev => {
      const current = prepareStateForToday(prev);
      return {
        ...current,
        name,
        setupComplete: true,
        phaseStartedAt: current.phaseStartedAt || todayStr(),
      };
    });
  }, []);

  const advancePhase = useCallback(() => {
    setState(prev => completeCurrentPhaseNow(prepareStateForToday(prev)).state);
    addXp(500);
  }, [addXp]);

  const resetState = useCallback(() => {
    Promise.all([AsyncStorage.removeItem(STORAGE_KEY), deleteGithubToken()]).then(() => {
      stateRef.current = INITIAL_STATE;
      setState(INITIAL_STATE);
    });
  }, []);

  const runDailyMaintenance = useCallback(async (): Promise<UploadPendingResult | null> => {
    const rolled = rollOverPlayerState(stateRef.current).state;
    stateRef.current = rolled;
    setState(rolled);
    const uploadResult = await uploadPendingLogItems(rolled);
    stateRef.current = uploadResult.state;
    setState(uploadResult.state);
    return uploadResult;
  }, []);

  const uploadPendingLogs = useCallback(async (): Promise<UploadPendingResult> => {
    const rolled = rollOverPlayerState(stateRef.current).state;
    stateRef.current = rolled;
    const uploadResult = await uploadPendingLogItems(rolled);
    stateRef.current = uploadResult.state;
    setState(uploadResult.state);
    return uploadResult;
  }, []);

  const saveGithubConfig = useCallback(async (config: GithubConfig) => {
    if (config.token) {
      await saveGithubToken(config.token);
    }

    setState(prev => ({
      ...prev,
      githubConfig: {
        owner: config.owner.trim(),
        repo: config.repo.trim(),
        tokenConfigured: Boolean(config.token || prev.githubConfig?.tokenConfigured),
      },
    }));
  }, []);

  const clearGithubConfig = useCallback(async () => {
    await deleteGithubToken();
    setState(prev => ({ ...prev, githubConfig: null }));
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
  const pendingUploadCount = state.uploadQueue.filter(item => item.status !== 'uploaded').length;

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
    markRestDay,
    setName,
    advancePhase,
    resetState,
    runDailyMaintenance,
    uploadPendingLogs,
    setGithubConfig: saveGithubConfig,
    clearGithubConfig,
    setTimetable: (timetable: TimeBlock[]) => setState(p => ({ ...prepareStateForToday(p), timetable: timetable.map(item => ({ ...item })) })),
    resetTimetable: () => setState(p => ({ ...prepareStateForToday(p), timetable: DAILY_TIMETABLE.map(item => ({ ...item })) })),
    // Computed
    todayCalories,
    todayProtein,
    waterPercent,
    xpPercent,
    routinesDone,
    currentAppDay: getCurrentAppDay(state),
    currentPhaseDay: getPhaseDayForState(state),
    pendingUploadCount,
  };
};
