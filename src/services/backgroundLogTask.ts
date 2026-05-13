import AsyncStorage from '@react-native-async-storage/async-storage';
import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import { STORAGE_KEY } from '../hooks/usePlayerState';
import { rollOverPlayerState, sanitizePlayerStateForStorage } from './dailyLogService';
import { uploadPendingLogItems } from './githubService';

const LOG_ROLLOVER_TASK = 'arise-log-rollover-task';

async function runStoredMaintenance(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return true;

  const parsed = JSON.parse(raw);
  const rolled = rollOverPlayerState(parsed);
  const uploaded = await uploadPendingLogItems(rolled.state);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizePlayerStateForStorage(uploaded.state)));
  return uploaded.failed === 0;
}

TaskManager.defineTask(LOG_ROLLOVER_TASK, async () => {
  try {
    const ok = await runStoredMaintenance();
    return ok
      ? BackgroundTask.BackgroundTaskResult.Success
      : BackgroundTask.BackgroundTaskResult.Failed;
  } catch {
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export async function registerLogBackgroundTask(): Promise<void> {
  const status = await BackgroundTask.getStatusAsync();
  if (status !== BackgroundTask.BackgroundTaskStatus.Available) return;

  const registered = await TaskManager.isTaskRegisteredAsync(LOG_ROLLOVER_TASK);
  if (registered) return;

  await BackgroundTask.registerTaskAsync(LOG_ROLLOVER_TASK, {
    minimumInterval: 15,
  });
}

export { LOG_ROLLOVER_TASK };
