import { Amal } from '@/types';

export const AMALAN_LIST: Amal[] = [
  // Fajr
  { id: 'solat_fajr', text: 'Solat Fajr', category: 'Fajr' },
  { id: 'quran_fajr', text: 'Quran 2 Pages', category: 'Fajr' },
  { id: 'zikir_pagi', text: 'Zikir Pagi', category: 'Fajr' },
  { id: 'dhuha', text: 'Solat Dhuha', category: 'Fajr' },
  
  // Dhuhr
  { id: 'solat_dhuhr', text: 'Solat Dhuhr', category: 'Dhuhr' },
  { id: 'solat_sunat_dhuhr', text: 'Solat Sunat Dhuhr', category: 'Dhuhr' },
  { id: 'tilawah_dhuhr', text: 'Tilawah 15 min', category: 'Dhuhr' },
  
  // Asar
  { id: 'solat_asar', text: 'Solat Asar', category: 'Asar' },
  { id: 'quran_asar', text: 'Quran 2 Pages', category: 'Asar' },
  { id: 'selawat_asar', text: 'Selawat x10', category: 'Asar' },
  
  // Maghrib
  { id: 'solat_maghrib', text: 'Solat Maghrib', category: 'Maghrib' },
  { id: 'solat_sunat_maghrib', text: 'Solat Sunat Maghrib', category: 'Maghrib' },
  { id: 'zikir_petang', text: 'Zikir Petang', category: 'Maghrib' },
  
  // Isyak
  { id: 'solat_isyak', text: 'Solat Isyak', category: 'Isyak' },
  { id: 'surah_al_waqiah', text: 'Surah Al-Waqiah', category: 'Isyak' },
  { id: 'zikir_berat_timbangan', text: 'Zikir Berat Timbangan x10', category: 'Isyak' },
];

export const PRAYER_TIMES: PrayerTime[] = ['Fajr', 'Dhuhr', 'Asar', 'Maghrib', 'Isyak'];

type PrayerTime = 'Fajr' | 'Dhuhr' | 'Asar' | 'Maghrib' | 'Isyak';
