import { Amal, PrayerTime } from '@/types';
import { AmalCheckbox } from './AmalCheckbox';
import { Sunrise, Sun, CloudSun, Sunset, Moon } from 'lucide-react';

interface PrayerSectionProps {
  prayerTime: PrayerTime;
  items: Amal[];
  completed: string[];
  onToggle: (id: string) => void;
}

const PRAYER_ICONS = {
  Fajr: Sunrise,
  Dhuhr: Sun,
  Asar: CloudSun,
  Maghrib: Sunset,
  Isyak: Moon,
};

export const PrayerSection = ({ prayerTime, items, completed, onToggle }: PrayerSectionProps) => {
  const Icon = PRAYER_ICONS[prayerTime];
  const completedInSection = items.filter(item => completed.includes(item.id)).length;
  const totalInSection = items.length;
  
  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center gap-3 px-1">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
          <Icon className="w-5 h-5 text-primary" strokeWidth={2} />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-foreground">{prayerTime}</h3>
          <p className="text-xs text-muted-foreground">
            {completedInSection} of {totalInSection} completed
          </p>
        </div>
      </div>
      
      <div className="space-y-2 pl-12">
        {items.map(item => (
          <AmalCheckbox
            key={item.id}
            id={item.id}
            text={item.text}
            checked={completed.includes(item.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
};
