import { PHASES } from '../data/phases';
import type { DailyState, PlayerState } from '../hooks/usePlayerState';

export type LogUploadStatus = 'pending' | 'uploaded' | 'failed';
export type DailyLogStatus = 'Completed' | 'Partial' | 'Missed' | 'Rest Day';

export interface DailyLogEntry {
  id: string;
  type: 'daily';
  date: string;
  phaseNumber: number;
  phaseName: string;
  phaseDay: number;
  appDay: number;
  status: DailyLogStatus;
  morningSessionCompleted: boolean;
  otherSessionCompleted: boolean;
  exerciseCompleted: boolean;
  mealStatus: string;
  calories: number;
  protein: number;
  waterMl: number;
  waterTargetMl: number;
  waterCompleted: boolean;
  restDay: boolean;
  completedTargets: string[];
  missedTargets: string[];
  meaningfulActivity: boolean;
  allTargetsCompleted: boolean;
  streakMaintained: boolean;
  streakAfterDay: number;
  notes: string[];
  generatedAt: string;
  githubPath: string;
  uploadStatus: LogUploadStatus;
  uploadedAt?: string;
  uploadError?: string;
}

export interface PhaseLogEntry {
  id: string;
  type: 'phase';
  phaseNumber: number;
  phaseName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  completedDays: number;
  missedDays: number;
  restDays: number;
  streakMaintainedDays: number;
  longestActivityRun: number;
  morningCompletedDays: number;
  exerciseCompletedDays: number;
  mealLoggedDays: number;
  calorieAverage: number;
  waterTargetDays: number;
  waterAverageMl: number;
  targetCompletionPercent: number;
  bestDays: string[];
  weakDays: string[];
  finalResult: string;
  summary: string;
  generatedAt: string;
  githubPath: string;
  uploadStatus: LogUploadStatus;
  uploadedAt?: string;
  uploadError?: string;
}

export interface UploadQueueItem {
  id: string;
  kind: 'daily' | 'phase';
  path: string;
  title: string;
  content: string;
  status: LogUploadStatus;
  attempts: number;
  createdAt: string;
  uploadedAt?: string;
  lastAttemptAt?: string;
  lastError?: string;
}

export interface RolloverResult {
  state: PlayerState;
  generatedDailyLogs: DailyLogEntry[];
  generatedPhaseLogs: PhaseLogEntry[];
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function localDateString(date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function parseLocalDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1, 12, 0, 0, 0);
}

export function addLocalDays(value: string, days: number): string {
  const date = parseLocalDate(value);
  date.setDate(date.getDate() + days);
  return localDateString(date);
}

export function compareLocalDates(a: string, b: string): number {
  return parseLocalDate(a).getTime() - parseLocalDate(b).getTime();
}

export function diffLocalDates(from: string, to: string): number {
  return Math.round((parseLocalDate(to).getTime() - parseLocalDate(from).getTime()) / MS_PER_DAY);
}

export function msUntilNextLocalMidnight(now = new Date()): number {
  const next = new Date(now);
  next.setDate(now.getDate() + 1);
  next.setHours(0, 0, 2, 0);
  return Math.max(1000, next.getTime() - now.getTime());
}

export function createDailyState(date = localDateString()): DailyState {
  return {
    date,
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
    restDay: false,
    restDayMarkedAt: undefined,
    streakCredited: false,
  };
}

export function normalizeDailyState(day?: Partial<DailyState>, fallbackDate = localDateString()): DailyState {
  return {
    ...createDailyState(day?.date || fallbackDate),
    ...(day || {}),
    meals: Array.isArray(day?.meals) ? day.meals : [],
    questsCompleted: day?.questsCompleted && typeof day.questsCompleted === 'object' ? day.questsCompleted : {},
    targetWaterMl: day?.targetWaterMl || 2750,
    energyLevel: day?.energyLevel || 3,
    symptomsLog: day?.symptomsLog || 'ok',
    restDay: Boolean(day?.restDay),
    streakCredited: Boolean(day?.streakCredited),
  };
}

export function getPhaseRequiredDays(phaseNumber: number): number {
  return Math.max(1, (PHASES[phaseNumber]?.durationWeeks || 1) * 7);
}

export function getScheduleIndexForPhaseDay(phaseNumber: number, phaseDay: number): number {
  const scheduleLength = PHASES[phaseNumber]?.schedule?.length || 1;
  return Math.max(0, (Math.max(1, phaseDay) - 1) % scheduleLength);
}

export function getPhaseDayForState(state: PlayerState): number {
  const requiredDays = getPhaseRequiredDays(state.currentPhase || 0);
  const raw = Number(state.currentPhaseDay || 1);
  return Math.max(1, Math.min(requiredDays, Number.isFinite(raw) ? raw : 1));
}

export function getCurrentAppDay(state: PlayerState): number {
  return Math.max(1, (state.totalDaysCompleted || 0) + 1);
}

export function sanitizeGithubConfig(config: PlayerState['githubConfig']): PlayerState['githubConfig'] {
  if (!config || !config.owner || !config.repo) return null;
  return {
    owner: config.owner.trim(),
    repo: config.repo.trim(),
    tokenConfigured: Boolean(config.tokenConfigured),
  };
}

export function sanitizePlayerStateForStorage(state: PlayerState): PlayerState {
  return {
    ...state,
    today: normalizeDailyState(state.today),
    githubConfig: sanitizeGithubConfig(state.githubConfig),
    dailyLogs: Array.isArray(state.dailyLogs) ? state.dailyLogs : [],
    phaseLogs: Array.isArray(state.phaseLogs) ? state.phaseLogs : [],
    uploadQueue: Array.isArray(state.uploadQueue) ? state.uploadQueue : [],
    history: Array.isArray(state.history) ? state.history : [],
  };
}

export function hasMeaningfulActivity(day: DailyState): boolean {
  const completedQuest = Object.values(day.questsCompleted || {}).some(Boolean);
  return Boolean(
    day.restDay ||
    day.breathingDone ||
    day.steamDone ||
    day.sunlightDone ||
    day.walkDone ||
    completedQuest ||
    day.waterMl > 0 ||
    day.meals.length > 0 ||
    day.sleepHours > 0
  );
}

export function creditStreakForDate(state: PlayerState, date: string): PlayerState {
  if (state.lastStreakDate === date) return state;

  const yesterday = addLocalDays(date, -1);
  const continues = state.lastStreakDate === yesterday;
  const streakDays = continues ? (state.streakDays || 0) + 1 : 1;

  return {
    ...state,
    streakDays,
    lastStreakDate: date,
    lastActiveDate: date,
  };
}

function finalizeStreakForDay(state: PlayerState, day: DailyState, meaningful: boolean): PlayerState {
  if (meaningful) {
    return day.streakCredited || state.lastStreakDate === day.date
      ? { ...state, lastActiveDate: day.date }
      : creditStreakForDate(state, day.date);
  }

  if (!state.lastStreakDate || compareLocalDates(day.date, state.lastStreakDate) > 0) {
    return {
      ...state,
      streakDays: 0,
      lastActiveDate: state.lastActiveDate || day.date,
    };
  }

  return state;
}

function caloriesFor(day: DailyState): number {
  return day.meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
}

function proteinFor(day: DailyState): number {
  return day.meals.reduce((sum, meal) => sum + (meal.protein || 0), 0);
}

function firstNumber(value?: string): number | null {
  const match = value?.replace(/,/g, '').match(/\d+/);
  return match ? Number(match[0]) : null;
}

function addTarget(
  completedTargets: string[],
  missedTargets: string[],
  done: boolean,
  label: string,
) {
  if (done) completedTargets.push(label);
  else missedTargets.push(label);
}

function dailyGithubPath(log: Pick<DailyLogEntry, 'phaseNumber' | 'date'>): string {
  return `logs/phase_${String(log.phaseNumber).padStart(2, '0')}/daily/${log.date}.md`;
}

function phaseGithubPath(log: Pick<PhaseLogEntry, 'phaseNumber' | 'startDate' | 'endDate'>): string {
  return `logs/phase_${String(log.phaseNumber).padStart(2, '0')}/phase_${String(log.phaseNumber).padStart(2, '0')}_overall_${log.startDate}_to_${log.endDate}.md`;
}

export function buildDailyLogEntry(
  state: PlayerState,
  dayInput: DailyState,
  phaseDay: number,
  appDay: number,
  streakAfterDay: number,
): DailyLogEntry {
  const day = normalizeDailyState(dayInput);
  const phase = PHASES[state.currentPhase] || PHASES[0];
  const scheduleIndex = getScheduleIndexForPhaseDay(state.currentPhase, phaseDay);
  const scheduleDay = phase.schedule[scheduleIndex];
  const trainingKey = `day_${scheduleIndex}`;
  const exerciseCompleted = Boolean(day.questsCompleted?.[trainingKey] || scheduleDay?.type === 'rest' || day.restDay);
  const morningSessionCompleted = Boolean(day.breathingDone || day.sunlightDone);
  const otherSessionCompleted = Boolean(day.steamDone || day.walkDone || exerciseCompleted);
  const waterCompleted = day.waterMl >= day.targetWaterMl;
  const calories = caloriesFor(day);
  const protein = proteinFor(day);
  const calorieTarget = firstNumber(phase.calorieTarget);
  const meaningfulActivity = hasMeaningfulActivity(day);
  const completedTargets: string[] = [];
  const missedTargets: string[] = [];
  const notes: string[] = [];

  if (day.restDay) {
    completedTargets.push('Rest Day marked by user');
    notes.push('Rest Day marked by user. Daily targets were intentionally paused and this day is not treated as a failure.');
  } else {
    addTarget(completedTargets, missedTargets, day.breathingDone, 'Morning breathing session');
    addTarget(completedTargets, missedTargets, day.sunlightDone, 'Morning sunlight session');
    addTarget(completedTargets, missedTargets, day.steamDone, 'Evening steam session');
    addTarget(completedTargets, missedTargets, day.walkDone, 'Walk session');
    addTarget(completedTargets, missedTargets, waterCompleted, `Hydration target (${(day.targetWaterMl / 1000).toFixed(1)}L)`);
    addTarget(completedTargets, missedTargets, exerciseCompleted, `Training session: ${scheduleDay?.label || 'Scheduled session'}`);
    addTarget(completedTargets, missedTargets, day.meals.length > 0, 'Meal/diet logged');
    if (calorieTarget) {
      addTarget(completedTargets, missedTargets, calories >= calorieTarget, `Calories target (${calorieTarget}+ kcal)`);
    }
  }

  if (!meaningfulActivity) {
    notes.push('No meaningful activity was recorded for this day.');
  }

  if (!day.restDay && missedTargets.length > 0) {
    notes.push(`${missedTargets.length} target(s) were missed or incomplete.`);
  }

  const allTargetsCompleted = !day.restDay && missedTargets.length === 0;
  const status: DailyLogStatus = day.restDay
    ? 'Rest Day'
    : allTargetsCompleted
      ? 'Completed'
      : meaningfulActivity
        ? 'Partial'
        : 'Missed';

  const log: DailyLogEntry = {
    id: `daily-${day.date}`,
    type: 'daily',
    date: day.date,
    phaseNumber: state.currentPhase,
    phaseName: phase.name,
    phaseDay,
    appDay,
    status,
    morningSessionCompleted,
    otherSessionCompleted,
    exerciseCompleted,
    mealStatus: day.meals.length > 0 ? `${day.meals.length} meal(s) logged` : 'No meals logged',
    calories,
    protein,
    waterMl: day.waterMl,
    waterTargetMl: day.targetWaterMl,
    waterCompleted,
    restDay: day.restDay,
    completedTargets,
    missedTargets,
    meaningfulActivity,
    allTargetsCompleted,
    streakMaintained: meaningfulActivity,
    streakAfterDay,
    notes,
    generatedAt: new Date().toISOString(),
    githubPath: '',
    uploadStatus: 'pending',
  };

  return { ...log, githubPath: dailyGithubPath(log) };
}

function completionRatio(log: DailyLogEntry): number {
  if (log.restDay) return 1;
  const total = log.completedTargets.length + log.missedTargets.length;
  return total === 0 ? 0 : log.completedTargets.length / total;
}

function longestRun(logs: DailyLogEntry[]): number {
  let best = 0;
  let current = 0;
  for (const log of logs) {
    if (log.meaningfulActivity) {
      current += 1;
      best = Math.max(best, current);
    } else {
      current = 0;
    }
  }
  return best;
}

export function buildPhaseLogEntry(
  state: PlayerState,
  phaseNumber: number,
  startDate: string,
  endDate: string,
  logs: DailyLogEntry[],
): PhaseLogEntry {
  const phase = PHASES[phaseNumber] || PHASES[0];
  const sorted = [...logs].sort((a, b) => compareLocalDates(a.date, b.date));
  const totalDays = Math.max(sorted.length, getPhaseRequiredDays(phaseNumber));
  const completedDays = sorted.filter(log => log.allTargetsCompleted).length;
  const restDays = sorted.filter(log => log.restDay).length;
  const missedDays = Math.max(0, totalDays - completedDays - restDays);
  const streakMaintainedDays = sorted.filter(log => log.meaningfulActivity).length;
  const morningCompletedDays = sorted.filter(log => log.morningSessionCompleted).length;
  const exerciseCompletedDays = sorted.filter(log => log.exerciseCompleted).length;
  const mealLoggedDays = sorted.filter(log => log.mealStatus !== 'No meals logged').length;
  const calorieAverage = Math.round(sorted.reduce((sum, log) => sum + log.calories, 0) / Math.max(1, sorted.length));
  const waterAverageMl = Math.round(sorted.reduce((sum, log) => sum + log.waterMl, 0) / Math.max(1, sorted.length));
  const waterTargetDays = sorted.filter(log => log.waterCompleted).length;
  const completedTargetCount = sorted.reduce((sum, log) => sum + log.completedTargets.length, 0);
  const targetCount = sorted.reduce((sum, log) => sum + log.completedTargets.length + log.missedTargets.length, 0);
  const targetCompletionPercent = targetCount === 0 ? 0 : Math.round((completedTargetCount / targetCount) * 100);
  const ranked = [...sorted].sort((a, b) => completionRatio(b) - completionRatio(a));
  const bestDays = ranked.slice(0, 3).map(log => `${log.date} (${log.status})`);
  const weakDays = ranked.slice(-3).reverse().map(log => `${log.date} (${log.status})`);
  const finalResult = targetCompletionPercent >= 85
    ? 'Excellent phase performance'
    : targetCompletionPercent >= 65
      ? 'Phase completed with moderate consistency'
      : 'Phase completed, but consistency needs attention';
  const summary = [
    `Phase ${phaseNumber} (${phase.name}) ran from ${startDate} to ${endDate}.`,
    `${completedDays} full day(s), ${restDays} rest day(s), and ${missedDays} incomplete/missed day(s) were recorded.`,
    `Overall target completion was ${targetCompletionPercent}%. ${finalResult}.`,
  ].join(' ');

  const log: PhaseLogEntry = {
    id: `phase-${phaseNumber}-${startDate}-${endDate}`,
    type: 'phase',
    phaseNumber,
    phaseName: phase.name,
    startDate,
    endDate,
    totalDays,
    completedDays,
    missedDays,
    restDays,
    streakMaintainedDays,
    longestActivityRun: longestRun(sorted),
    morningCompletedDays,
    exerciseCompletedDays,
    mealLoggedDays,
    calorieAverage,
    waterTargetDays,
    waterAverageMl,
    targetCompletionPercent,
    bestDays,
    weakDays,
    finalResult,
    summary,
    generatedAt: new Date().toISOString(),
    githubPath: '',
    uploadStatus: 'pending',
  };

  return { ...log, githubPath: phaseGithubPath(log) };
}

export function renderDailyLogMarkdown(log: DailyLogEntry): string {
  return `# ARISE Daily Log - ${log.date}

## Day Status
- Date: ${log.date}
- Phase: ${log.phaseNumber} - ${log.phaseName}
- Phase Day: ${log.phaseDay}
- Overall App Day: ${log.appDay}
- Status: ${log.status}
- Rest Day: ${log.restDay ? 'Yes - Rest Day' : 'No'}
- Streak Maintained: ${log.streakMaintained ? 'Yes' : 'No'}
- Streak After This Day: ${log.streakAfterDay}

## Sessions
- Morning Session: ${log.morningSessionCompleted ? 'Completed' : 'Missed'}
- Other Session: ${log.otherSessionCompleted ? 'Completed' : 'Missed'}
- Exercise/Training: ${log.exerciseCompleted ? 'Completed' : 'Missed'}

## Health And Nutrition
- Meal/Diet Status: ${log.mealStatus}
- Calories: ${log.calories} kcal
- Protein: ${log.protein} g
- Water Intake: ${log.waterMl} ml / ${log.waterTargetMl} ml
- Water Target: ${log.waterCompleted ? 'Completed' : 'Incomplete'}

## Completed Targets
${log.completedTargets.length ? log.completedTargets.map(item => `- ${item}`).join('\n') : '- None recorded'}

## Missed Targets
${log.missedTargets.length ? log.missedTargets.map(item => `- ${item}`).join('\n') : '- None'}

## Notes
${log.notes.length ? log.notes.map(item => `- ${item}`).join('\n') : '- No errors or notes recorded.'}

---
Generated by ARISE: The System.
`;
}

export function renderPhaseLogMarkdown(log: PhaseLogEntry): string {
  return `# ARISE Phase ${log.phaseNumber} Overall Log - ${log.phaseName}

## Phase Window
- Phase: ${log.phaseNumber} - ${log.phaseName}
- Start Date: ${log.startDate}
- End Date: ${log.endDate}
- Total Days In Phase: ${log.totalDays}

## Performance
- Completed Days: ${log.completedDays}
- Missed/Incomplete Days: ${log.missedDays}
- Rest Days: ${log.restDays}
- Streak Maintained Days: ${log.streakMaintainedDays}
- Longest Activity Run: ${log.longestActivityRun} day(s)
- Overall Target Completion: ${log.targetCompletionPercent}%

## Session Summary
- Morning Session Completion: ${log.morningCompletedDays}/${log.totalDays}
- Exercise Completion: ${log.exerciseCompletedDays}/${log.totalDays}
- Meal/Diet Logged: ${log.mealLoggedDays}/${log.totalDays}
- Average Calories: ${log.calorieAverage} kcal/day
- Water Target Days: ${log.waterTargetDays}/${log.totalDays}
- Average Water Intake: ${log.waterAverageMl} ml/day

## Best Days
${log.bestDays.length ? log.bestDays.map(item => `- ${item}`).join('\n') : '- Not enough data'}

## Weak Days
${log.weakDays.length ? log.weakDays.map(item => `- ${item}`).join('\n') : '- Not enough data'}

## Final Result
${log.finalResult}

## Summary
${log.summary}

---
Generated by ARISE: The System.
`;
}

function createUploadItem(log: DailyLogEntry | PhaseLogEntry): UploadQueueItem {
  const isDaily = log.type === 'daily';
  return {
    id: log.id,
    kind: log.type,
    path: log.githubPath,
    title: isDaily ? `Daily Log ${log.date}` : `Phase ${log.phaseNumber} Overall Log`,
    content: isDaily ? renderDailyLogMarkdown(log) : renderPhaseLogMarkdown(log),
    status: 'pending',
    attempts: 0,
    createdAt: log.generatedAt,
  };
}

function upsertDailyLog(logs: DailyLogEntry[], log: DailyLogEntry): DailyLogEntry[] {
  const next = logs.filter(item => item.id !== log.id);
  return [log, ...next].sort((a, b) => compareLocalDates(b.date, a.date));
}

function upsertPhaseLog(logs: PhaseLogEntry[], log: PhaseLogEntry): PhaseLogEntry[] {
  const next = logs.filter(item => item.id !== log.id);
  return [log, ...next].sort((a, b) => compareLocalDates(b.endDate, a.endDate));
}

function upsertUploadItem(items: UploadQueueItem[], item: UploadQueueItem): UploadQueueItem[] {
  const existing = items.find(entry => entry.id === item.id);
  if (existing?.status === 'uploaded') return items;

  const merged = existing
    ? { ...existing, content: item.content, path: item.path, title: item.title, status: 'pending' as const }
    : item;

  return [merged, ...items.filter(entry => entry.id !== item.id)];
}

function estimatePhaseStartedAt(state: PlayerState): string {
  if (state.phaseStartedAt) return state.phaseStartedAt;
  const phaseDay = getPhaseDayForState(state);
  return addLocalDays(state.today?.date || localDateString(), -(phaseDay - 1));
}

export function rollOverPlayerState(input: PlayerState, targetDate = localDateString()): RolloverResult {
  let state: PlayerState = sanitizePlayerStateForStorage({
    ...input,
    today: normalizeDailyState(input.today),
    currentPhaseDay: getPhaseDayForState(input),
    phaseStartedAt: estimatePhaseStartedAt(input),
    totalDaysCompleted: Math.max(0, input.totalDaysCompleted || 0),
    completedPhases: Array.isArray(input.completedPhases) ? input.completedPhases : [],
    weeklyXp: Array.isArray(input.weeklyXp) && input.weeklyXp.length === 7 ? input.weeklyXp : [0, 0, 0, 0, 0, 0, 0],
  });
  const generatedDailyLogs: DailyLogEntry[] = [];
  const generatedPhaseLogs: PhaseLogEntry[] = [];

  while (diffLocalDates(state.today.date, targetDate) > 0) {
    const endedDay = normalizeDailyState(state.today);
    const appDay = (state.totalDaysCompleted || 0) + 1;
    const phaseDay = getPhaseDayForState(state);
    state = finalizeStreakForDay(state, endedDay, hasMeaningfulActivity(endedDay));

    const dailyLog = buildDailyLogEntry(state, endedDay, phaseDay, appDay, state.streakDays || 0);
    generatedDailyLogs.push(dailyLog);

    const nextDate = addLocalDays(endedDay.date, 1);
    const updatedDailyLogs = upsertDailyLog(state.dailyLogs || [], dailyLog);
    const requiredDays = getPhaseRequiredDays(state.currentPhase);

    state = {
      ...state,
      totalDaysCompleted: appDay,
      shadowCount: Math.floor(appDay / 7),
      dailyLogs: updatedDailyLogs,
      uploadQueue: upsertUploadItem(state.uploadQueue || [], createUploadItem(dailyLog)),
      weeklyXp: [...(state.weeklyXp || [0, 0, 0, 0, 0, 0, 0]).slice(1), 0],
      today: createDailyState(nextDate),
    };

    if (phaseDay >= requiredDays) {
      const phaseNumber = state.currentPhase;
      const logsForPhase = updatedDailyLogs
        .filter(log => log.phaseNumber === phaseNumber)
        .sort((a, b) => compareLocalDates(a.date, b.date));
      const phaseStart = state.phaseStartedAt || logsForPhase[0]?.date || endedDay.date;
      const phaseLog = buildPhaseLogEntry(state, phaseNumber, phaseStart, endedDay.date, logsForPhase);
      generatedPhaseLogs.push(phaseLog);

      state = {
        ...state,
        completedPhases: state.completedPhases.includes(phaseNumber)
          ? state.completedPhases
          : [...state.completedPhases, phaseNumber],
        currentPhase: Math.min(phaseNumber + 1, PHASES.length - 1),
        currentPhaseDay: 1,
        phaseStartedAt: nextDate,
        phaseLogs: upsertPhaseLog(state.phaseLogs || [], phaseLog),
        dailyLogs: state.dailyLogs.filter(log => log.phaseNumber !== phaseNumber),
        uploadQueue: upsertUploadItem(state.uploadQueue || [], createUploadItem(phaseLog)),
      };
    } else {
      state = {
        ...state,
        currentPhaseDay: phaseDay + 1,
      };
    }
  }

  return { state: sanitizePlayerStateForStorage(state), generatedDailyLogs, generatedPhaseLogs };
}

export function completeCurrentPhaseNow(input: PlayerState): RolloverResult {
  const state = sanitizePlayerStateForStorage(input);
  const phaseNumber = state.currentPhase;
  const logsForPhase = (state.dailyLogs || [])
    .filter(log => log.phaseNumber === phaseNumber)
    .sort((a, b) => compareLocalDates(a.date, b.date));
  const endDate = logsForPhase[logsForPhase.length - 1]?.date || addLocalDays(state.today.date, -1);
  const phaseStart = state.phaseStartedAt || logsForPhase[0]?.date || state.today.date;
  const phaseLog = buildPhaseLogEntry(state, phaseNumber, phaseStart, endDate, logsForPhase);
  const nextState = sanitizePlayerStateForStorage({
    ...state,
    completedPhases: state.completedPhases.includes(phaseNumber)
      ? state.completedPhases
      : [...state.completedPhases, phaseNumber],
    currentPhase: Math.min(phaseNumber + 1, PHASES.length - 1),
    currentPhaseDay: 1,
    phaseStartedAt: state.today.date,
    phaseLogs: upsertPhaseLog(state.phaseLogs || [], phaseLog),
    dailyLogs: state.dailyLogs.filter(log => log.phaseNumber !== phaseNumber),
    uploadQueue: upsertUploadItem(state.uploadQueue || [], createUploadItem(phaseLog)),
  });

  return { state: nextState, generatedDailyLogs: [], generatedPhaseLogs: [phaseLog] };
}
