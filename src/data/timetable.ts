export interface TimeBlock {
  start: string;
  end?: string;
  task: string;
  note?: string;
}

export const DAILY_TIMETABLE: TimeBlock[] = [
  { start: '5:00 AM', end: '5:15 AM', task: 'Wake up, water, freshen up', note: 'No phone scrolling' },
  { start: '5:15 AM', end: '6:15 AM', task: 'Exercise' },
  { start: '6:15 AM', end: '6:45 AM', task: 'Bath + breakfast' },
  { start: '6:45 AM', end: '8:45 AM', task: 'QA concept + examples + practice' },
  { start: '8:45 AM', end: '9:15 AM', task: 'Break' },
  { start: '9:15 AM', end: '10:45 AM', task: 'VARC: RC + VA' },
  { start: '10:45 AM', end: '11:00 AM', task: 'Break' },
  { start: '11:00 AM', end: '12:30 PM', task: 'DILR sets' },
  { start: '12:30 PM', end: '1:30 PM', task: 'Lunch + rest' },
  { start: '1:30 PM', end: '2:30 PM', task: 'Timed practice' },
  { start: '2:30 PM', end: '3:30 PM', task: 'Error log + revision' },
  { start: '3:30 PM', end: '4:00 PM', task: 'Break' },
  { start: '4:00 PM', end: '5:00 PM', task: 'Trading/investing learning' },
  { start: '5:00 PM', end: '7:00 PM', task: 'Gaming YouTube channel work' },
  { start: '7:00 PM', end: '8:00 PM', task: 'Dinner' },
  { start: '8:00 PM', end: '9:00 PM', task: 'Light CAT revision / reading' },
  { start: '9:00 PM', end: '9:45 PM', task: 'Plan next day + wind down' },
  { start: '10:00 PM', task: 'Sleep' },
];
