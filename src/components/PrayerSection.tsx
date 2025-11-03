import { useState, useEffect } from 'react';
import { Amal, PrayerTime } from '@/types';
import { AmalCheckbox } from './AmalCheckbox';
import { Sunrise, Sun, CloudSun, Sunset, Moon, ChevronDown, Plus } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PrayerSectionProps {
  prayerTime: PrayerTime;
  items: Amal[];
  completed: string[];
  onToggle: (id: string) => void;
  onEdit: (amal: Amal) => void;
  onDelete: (id: string) => void;
  onAdd: (category: PrayerTime) => void;
}

const PRAYER_ICONS = {
  Fajr: Sunrise,
  Dhuhr: Sun,
  Asar: CloudSun,
  Maghrib: Sunset,
  Isyak: Moon,
};

export const PrayerSection = ({ 
  prayerTime, 
  items, 
  completed, 
  onToggle, 
  onEdit, 
  onDelete,
  onAdd 
}: PrayerSectionProps) => {
  const Icon = PRAYER_ICONS[prayerTime];
  const completedInSection = items.filter(item => completed.includes(item.id)).length;
  const totalInSection = items.length;
  const allCompleted = totalInSection > 0 && completedInSection === totalInSection;
  
  const [isOpen, setIsOpen] = useState(true);

  // Auto-collapse when all items are completed
  useEffect(() => {
    if (allCompleted) {
      setIsOpen(false);
    }
  }, [allCompleted]);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-3 animate-fade-in">
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onAdd(prayerTime)}
          className="h-8 w-8"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronDown 
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isOpen && "rotate-180"
              )} 
            />
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent className="space-y-2 pl-12">
        {items.map(item => (
          <AmalCheckbox
            key={item.id}
            id={item.id}
            text={item.text}
            checked={completed.includes(item.id)}
            onToggle={onToggle}
            onEdit={() => onEdit(item)}
            onDelete={() => onDelete(item.id)}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
