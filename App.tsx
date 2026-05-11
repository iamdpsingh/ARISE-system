import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, StatusBar, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as ExpoWidgetsModule from '@bittingz/expo-widgets';

import { usePlayerState } from './src/hooks/usePlayerState';
import { COLORS, FONTS } from './src/theme/theme';
import SystemAlert from './src/components/SystemAlert';
import OnboardingScreen from './src/screens/OnboardingScreen';
import StatusScreen from './src/screens/StatusScreen';
import DailyQuestScreen from './src/screens/DailyQuestScreen';
import TimetableScreen from './src/screens/TimetableScreen';
import NutritionScreen from './src/screens/NutritionScreen';
import PhaseMapScreen from './src/screens/PhaseMapScreen';
import HealthScreen from './src/screens/HealthScreen';
import {
  requestNotificationPermissions,
  scheduleAllNotifications,
  sendPenaltyAlert,
} from './src/notifications/scheduler';
import { pushLogToGithub } from './src/services/githubService';
import SettingsModal from './src/components/SettingsModal';
import HistoryScreen from './src/screens/HistoryScreen';
import type { TimeBlock } from './src/data/timetable';
import { PHASES } from './src/data/phases';

// ── Notification handler ────────────────────────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ── Navigator setup ─────────────────────────────────────────
const Tab = createBottomTabNavigator();

const NAV_THEME = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: COLORS.bg, card: '#060a0f', border: COLORS.borderDim, text: COLORS.textPrimary },
};

const TAB_ICONS: Record<string, string> = {
  Status: '⚔',
  Quest: '📋',
  Timetable: '⏰',
  Records: '📜',
  Nutrition: '🍽',
  Phases: '🗺',
  Health: '💊',
};

const TAB_LABELS: Record<string, string> = {
  Status: 'STATUS',
  Quest: 'QUEST',
  Timetable: 'TABLE',
  Records: 'LOGS',
  Nutrition: 'FOOD',
  Phases: 'PHASES',
  Health: 'HEALTH',
};

const localDateString = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const parseClockTimeToMinutes = (value?: string) => {
  if (!value) return null;
  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const ampm = match[3].toUpperCase();

  if (Number.isNaN(hours) || Number.isNaN(minutes) || hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
    return null;
  }

  if (hours === 12) hours = 0;
  if (ampm === 'PM') hours += 12;
  return (hours * 60) + minutes;
};

const resolveTimetableWidgetLines = (timetable: TimeBlock[]) => {
  const cleanedSlots = (timetable || [])
    .map(slot => {
      const startMinutes = parseClockTimeToMinutes(slot.start);
      const endMinutes = parseClockTimeToMinutes(slot.end);
      return {
        start: slot.start?.trim() || '',
        end: slot.end?.trim() || '',
        task: slot.task?.trim() || '',
        startMinutes,
        endMinutes: endMinutes ?? (startMinutes !== null ? Math.min(startMinutes + 60, 24 * 60) : null),
      };
    })
    .filter(slot => slot.start && slot.task && slot.startMinutes !== null)
    .sort((a, b) => (a.startMinutes ?? 0) - (b.startMinutes ?? 0));

  if (cleanedSlots.length === 0) {
    return {
      current: 'No valid slots',
      next: 'Use TIMETABLE tab',
    };
  }

  const now = new Date();
  const nowMinutes = (now.getHours() * 60) + now.getMinutes();

  const activeSlot = cleanedSlots.find(slot => {
    if (slot.startMinutes === null || slot.endMinutes === null) return false;
    return nowMinutes >= slot.startMinutes && nowMinutes < slot.endMinutes;
  });

  const upcomingSlot =
    cleanedSlots.find(slot => slot.startMinutes !== null && slot.startMinutes > nowMinutes) || cleanedSlots[0];

  const current = activeSlot
    ? `${activeSlot.start}${activeSlot.end ? `-${activeSlot.end}` : ''} ${activeSlot.task}`
    : 'No active slot';
  const next = upcomingSlot
    ? `${upcomingSlot.start}${upcomingSlot.end ? `-${upcomingSlot.end}` : ''} ${upcomingSlot.task}`
    : 'No upcoming slot';

  return { current, next };
};

// ── Main App ────────────────────────────────────────────────
export default function App() {
  const {
    state, loaded,
    addXp, allocateStat,
    addWater, logMeal, removeMeal,
    completeQuest, markRoutine,
    logSleep, logEnergy, logSymptoms,
    completeDailyAll, setName, advancePhase,
    resetState,
    setGithubConfig, clearGithubConfig, setTimetable, resetTimetable,
    todayCalories, todayProtein, waterPercent, xpPercent,
  } = usePlayerState();

  const [alert, setAlert] = useState<{ visible: boolean; title: string; message: string; type?: any }>({
    visible: false, title: '', message: '',
  });
  const [showEmergency, setShowEmergency] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [testingSync, setTestingSync] = useState(false);

  // ── Set up notifications on first load ─────────────────
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      const granted = await requestNotificationPermissions();
      if (granted) await scheduleAllNotifications(state.timetable);
    })();
  }, [loaded, state.timetable]);

  // ── Sync home-screen widget data ───────────────────────
  useEffect(() => {
    if (!loaded || !state.setupComplete) return;

    const routineDone = [
      state.today.breathingDone,
      state.today.steamDone,
      state.today.sunlightDone,
      state.today.walkDone,
    ].filter(Boolean).length;
    const phaseSchedule = PHASES[state.currentPhase]?.schedule || [];
    const currentDayIdx = new Date().getDay();
    const mappedDayIdx = phaseSchedule.length > 0 ? currentDayIdx % phaseSchedule.length : 0;
    const currentDay = phaseSchedule[mappedDayIdx];
    const trainingDone = !!state.today.questsCompleted[`day_${mappedDayIdx}`] || currentDay?.type === 'rest';
    const { current, next } = resolveTimetableWidgetLines(state.timetable);

    const payload = JSON.stringify({
      name: state.name || 'HUNTER',
      level: state.level,
      rank: state.rank,
      phase: state.currentPhase,
      streak: state.streakDays,
      status: state.today.allDailyCompleted ? 'MISSION COMPLETE' : 'MISSION IN PROGRESS',
      quest: {
        routineDone,
        routineTotal: 4,
        trainingDone,
        allDone: state.today.allDailyCompleted,
      },
      nutrition: {
        calories: Math.round(todayCalories),
        protein: Number(todayProtein.toFixed(1)),
        meals: state.today.meals.length,
      },
      water: {
        currentMl: state.today.waterMl,
        targetMl: state.today.targetWaterMl,
        percent: Math.round(waterPercent),
      },
      timetable: {
        current,
        next,
      },
    });

    try {
      if (Platform.OS === 'ios') {
        const iosSetter = (ExpoWidgetsModule as any).setWidgetData;
        if (typeof iosSetter === 'function') iosSetter(payload);
        return;
      }

      const androidPackage = Constants.expoConfig?.android?.package;
      const androidSetter = (ExpoWidgetsModule as any).setWidgetData;
      if (androidPackage && typeof androidSetter === 'function') {
        androidSetter(payload, androidPackage);
      }
    } catch (error) {
      // Widget module may be unavailable in Expo Go; ignore gracefully.
      console.log('Widget sync skipped:', error);
    }
  }, [loaded, state, todayCalories, todayProtein, waterPercent]);

  // ── Penalty alert for missed days ──────────────────────
  useEffect(() => {
    if (!loaded || !state.setupComplete) return;
    const today = localDateString();
    if (state.lastActiveDate && state.lastActiveDate !== today) {
      const missed = Math.floor(
        (new Date(today).getTime() - new Date(state.lastActiveDate).getTime()) / 86400000
      );
      if (missed >= 2) {
        sendPenaltyAlert(missed);
        showAlert('PENALTY DUNGEON ACTIVATED', `You have been absent for ${missed} days. The System has noticed. The Dungeon awaits. Return now.`, 'penalty');
      }
    }
  }, [loaded]);

  const showAlert = (title: string, message: string, type: any = 'system') => {
    setAlert({ visible: true, title, message, type });
  };

  const handleCompleteExercise = useCallback((id: string, xp: number) => {
    completeQuest(id, xp);
  }, [completeQuest]);

  const handleMarkRoutine = useCallback((key: 'breathingDone' | 'steamDone' | 'sunlightDone' | 'walkDone') => {
    markRoutine(key);
    showAlert('ROUTINE COMPLETE', `Daily health habit logged. +25 XP earned.`, 'quest');
  }, [markRoutine]);

  const handleAdvancePhase = useCallback(() => {
    advancePhase();
    const nextPhase = state.currentPhase + 1;
    showAlert('PHASE ADVANCED', `You have entered Phase ${nextPhase}. Your body has changed. +500 XP. 5 stat points granted.`, 'levelup');
  }, [advancePhase, state.currentPhase]);

  const handleCompleteDailyAll = useCallback(async () => {
    completeDailyAll();
    showAlert('DAILY QUEST COMPLETE', 'All missions accomplished. +200 XP. Streak updated.', 'levelup');
    
    if (state.githubConfig) {
      setSyncing(true);
      const res = await pushLogToGithub({
        ...state,
        totalDaysCompleted: state.totalDaysCompleted + 1,
        today: { ...state.today, allDailyCompleted: true },
      });
      setSyncing(false);
      if (res.success) {
        setAlert({
          visible: true,
          title: 'SYSTEM SYNCHRONIZED',
          message: res.fileUrl
            ? `Mission log pushed to GitHub.\n${res.fileUrl}`
            : 'Mission log has been pushed to GitHub.',
          type: 'quest',
        });
      } else {
        setAlert({ visible: true, title: 'SYNC FAILED', message: res.error || 'Unknown error', type: 'penalty' });
      }
    }
  }, [completeDailyAll, state]);

  const handleSaveTimetable = useCallback((timetable: TimeBlock[]) => {
    setTimetable(timetable);
    showAlert('TIMETABLE UPDATED', 'Your daily timetable has been saved.', 'quest');
  }, [setTimetable]);

  const handleResetTimetable = useCallback(() => {
    resetTimetable();
    showAlert('TIMETABLE RESET', 'Default timetable restored.', 'system');
  }, [resetTimetable]);

  const handleTestSync = useCallback(async () => {
    if (!state.githubConfig) {
      showAlert('SYNC FAILED', 'Configure GitHub token, owner, and repo first.', 'penalty');
      return;
    }

    setTestingSync(true);
    const res = await pushLogToGithub({
      ...state,
      today: { ...state.today, allDailyCompleted: true },
    });
    setTestingSync(false);

    if (res.success) {
      showAlert(
        'GITHUB TEST PASSED',
        res.fileUrl
          ? `Log upload is working.\n${res.fileUrl}`
          : 'Log upload is working for current configuration.',
        'quest'
      );
      return;
    }

    showAlert('GITHUB TEST FAILED', res.error || 'Unknown sync error.', 'penalty');
  }, [state]);

  if (!loaded) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ ...FONTS.system, color: COLORS.cyan, fontSize: 16, letterSpacing: 4 }}>SYSTEM LOADING...</Text>
      </View>
    );
  }

  if (!state.setupComplete) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
        <OnboardingScreen onComplete={(name) => {
          setName(name);
          showAlert('ARISE', `Welcome, ${name}. The System has never chosen the wrong person. Phase 0 begins now.`, 'levelup');
        }} />
      </>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      <NavigationContainer theme={NAV_THEME}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused }) => (
              <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.4 }}>{TAB_ICONS[route.name]}</Text>
            ),
            tabBarLabel: ({ focused }) => (
            <Text style={{
              ...FONTS.system,
              color: focused ? COLORS.cyan : COLORS.textSub,
              fontSize: 9,
              letterSpacing: 1,
              marginBottom: Platform.OS === 'ios' ? 0 : 4,
            }}>
              {TAB_LABELS[route.name] || route.name.toUpperCase()}
            </Text>
          ),
          tabBarActiveTintColor: COLORS.cyan,
          tabBarInactiveTintColor: COLORS.textSub,
          tabBarStyle: styles.tabBar,
          headerShown: false,
        })}
      >
        <Tab.Screen name="Status">
          {() => (
            <StatusScreen
              state={state}
              xpPercent={xpPercent}
              onAllocate={(stat) => {
                allocateStat(stat);
                showAlert('STAT INCREASED', `${stat.toUpperCase()} has improved. Your body grows stronger.`, 'quest');
              }}
              onToggleSettings={() => setShowSettings(true)}
              syncing={syncing}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="Quest">
          {() => (
            <DailyQuestScreen
              state={state}
              onMarkRoutine={handleMarkRoutine}
              onCompleteExercise={handleCompleteExercise}
              onCompleteDailyAll={handleCompleteDailyAll}
              onLogEnergy={logEnergy}
              onLogSymptoms={logSymptoms}
              onLogSleep={logSleep}
              onEmergency={() => setShowEmergency(true)}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="Timetable">
          {() => (
            <TimetableScreen
              timetable={state.timetable}
              onSaveTimetable={handleSaveTimetable}
              onResetTimetable={handleResetTimetable}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="Records">
          {() => <HistoryScreen state={state} />}
        </Tab.Screen>

        <Tab.Screen name="Nutrition">
          {() => (
            <NutritionScreen
              state={state}
              todayCalories={todayCalories}
              todayProtein={todayProtein}
              waterPercent={waterPercent}
              onAddWater={addWater}
              onLogMeal={logMeal}
              onRemoveMeal={removeMeal}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="Phases">
          {() => (
            <PhaseMapScreen
              state={state}
              onAdvancePhase={handleAdvancePhase}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="Health">
          {() => <HealthScreen state={state} />}
        </Tab.Screen>
      </Tab.Navigator>

      <SettingsModal
        visible={showSettings}
        config={state.githubConfig}
        onClose={() => setShowSettings(false)}
        onSave={setGithubConfig}
        onClear={clearGithubConfig}
        onTestSync={handleTestSync}
        testingSync={testingSync}
        onReset={() => {
          resetState();
          setShowSettings(false);
          showAlert('SYSTEM REBOOTED', 'All progress has been wiped. You are back at Phase 0. The world has been reset.', 'penalty');
        }}
      />

      {/* ── System Alert Overlay ───────────────────────────── */}
      <SystemAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onDismiss={() => setAlert(a => ({ ...a, visible: false }))}
      />

      {/* ── Emergency Protocol Overlay ─────────────────────── */}
      <SystemAlert
        visible={showEmergency}
        title="EMERGENCY PROTOCOL ACTIVATED"
        message={"STEP 1: Sit upright — do not lie flat.\nSTEP 2: Start steam immediately — bowl + hot water + towel.\nSTEP 3: Sip warm water slowly.\nSTEP 4: Breathe — 4-count in, 6-count out. Long exhale.\nSTEP 5: Elevate head if sleeping."}
        type="penalty"
        onDismiss={() => setShowEmergency(false)}
      />
    </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#060a0f',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderNeon,
    minHeight: 65,
    paddingTop: 8,
  },
});
