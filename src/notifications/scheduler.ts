import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { DAILY_TIMETABLE, TimeBlock } from '../data/timetable';

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('arise-system', {
      name: 'ARISE System',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#00f3ff',
      sound: 'default',
      bypassDnd: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }

  return true;
}

export async function scheduleAllNotifications(timetable: TimeBlock[] = DAILY_TIMETABLE) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  const parseHourMinute = (timeStr: string) => {
    const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return null;

    const rawHour = Number(match[1]);
    const minute = Number(match[2]);
    const ampm = match[3].toUpperCase();
    let hour = rawHour % 12;
    if (ampm === 'PM') hour += 12;

    return { hour, minute };
  };

  for (const slot of timetable) {
    const parsed = parseHourMinute(slot.start);
    if (!parsed) continue;

    const title = slot.task.toLowerCase().includes('break')
      ? '⏸ Break Block'
      : slot.task.toLowerCase().includes('sleep')
        ? '🌙 Sleep Block'
        : `[ SYSTEM ] ${slot.task}`;
    const body = slot.end
      ? `${slot.start} - ${slot.end}${slot.note ? ` · ${slot.note}` : ''}`
      : `${slot.start}${slot.note ? ` · ${slot.note}` : ''}`;

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: 'max',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: parsed.hour,
        minute: parsed.minute,
      },
    });
  }

  const hydrationReminders = [
    { hour: 7, minute: 30 },
    { hour: 10, minute: 30 },
    { hour: 14, minute: 45 },
    { hour: 18, minute: 30 },
    { hour: 21, minute: 15 },
  ];

  for (const reminder of hydrationReminders) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💧 Hydration Check',
        body: 'Drink 300 ml warm water.',
        sound: true,
        priority: 'max',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: reminder.hour,
        minute: reminder.minute,
      },
    });
  }

  console.log('✅ All ARISE notifications scheduled.');
}

export async function sendPenaltyAlert(missedDays: number) {
  await Notifications.scheduleNotificationAsync({
    content: { title: `⚠ [ PENALTY DUNGEON ACTIVATED ]`, body: `You have missed ${missedDays} days. Return now.`, sound: true, priority: 'max' },
    trigger: null,
  });
}

export async function sendLevelUpNotification(newLevel: number, newRank: string) {
  await Notifications.scheduleNotificationAsync({
    content: { title: `⚡ LEVEL UP — LEVEL ${newLevel}`, body: `You have grown stronger. Rank: ${newRank}.`, sound: true, priority: 'max' },
    trigger: null,
  });
}
