import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AmalCheckboxProps {
  id: string;
  text: string;
  checked: boolean;
  onToggle: (id: string) => void;
}

export const AmalCheckbox = ({ id, text, checked, onToggle }: AmalCheckboxProps) => {
  return (
    <button
      onClick={() => onToggle(id)}
      className={cn(
        "w-full flex items-center gap-3 p-4 rounded-lg border transition-all duration-300",
        "hover:shadow-soft active:scale-[0.98]",
        checked
          ? "bg-primary/5 border-primary/30"
          : "bg-card border-border hover:border-primary/30"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-6 h-6 rounded-md border-2 transition-all duration-300",
          "flex items-center justify-center",
          checked
            ? "bg-primary border-primary scale-100"
            : "bg-background border-muted-foreground/30 hover:border-primary/50"
        )}
      >
        {checked && (
          <Check 
            className="w-4 h-4 text-primary-foreground animate-check-bounce" 
            strokeWidth={3}
          />
        )}
      </div>
      
      <span
        className={cn(
          "text-left text-sm font-medium transition-all duration-300",
          checked
            ? "text-muted-foreground line-through"
            : "text-foreground"
        )}
      >
        {text}
      </span>
    </button>
  );
};
