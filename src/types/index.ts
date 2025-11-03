export interface Amal {
  id: string;
  text: string;
  category: PrayerTime;
}

export type PrayerTime = 'Fajr' | 'Dhuhr' | 'Asar' | 'Maghrib' | 'Isyak';

export interface DailyProgress {
  date: string;
  completed: string[];
  percentage: number;
}
