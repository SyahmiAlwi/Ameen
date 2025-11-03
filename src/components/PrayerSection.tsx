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

  // Auto-collapse when all items are completed with delay
  useEffect(() => {
    if (allCompleted && isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [allCompleted, isOpen]);
  
  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={setIsOpen} 
      className={cn(
        "space-y-3 animate-fade-in transition-all duration-500",
        allCompleted && "opacity-70"
      )}
    >
      <div className={cn(
        "flex items-center gap-3 px-1 transition-all duration-500",
        allCompleted && "scale-[0.98]"
      )}>
        <div className={cn(
          "flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-500",
          allCompleted 
            ? "bg-primary/20 shadow-glow" 
            : "bg-primary/10"
        )}>
          <Icon 
            className={cn(
              "w-5 h-5 text-primary transition-all duration-500",
              allCompleted && "scale-110"
            )} 
            strokeWidth={2} 
          />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-foreground">{prayerTime}</h3>
          <p className={cn(
            "text-xs transition-colors duration-500",
            allCompleted ? "text-primary font-medium" : "text-muted-foreground"
          )}>
            {completedInSection} of {totalInSection} completed
            {allCompleted && " ✓"}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onAdd(prayerTime)}
          className="h-8 w-8 hover:bg-primary/10 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 hover:bg-primary/10 transition-colors"
          >
            <ChevronDown 
              className={cn(
                "h-4 w-4 transition-transform duration-300",
                isOpen && "rotate-180"
              )} 
            />
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent className="space-y-2 pl-12 overflow-hidden transition-all duration-500">
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
