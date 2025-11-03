import { Check, Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AmalCheckboxProps {
  id: string;
  text: string;
  checked: boolean;
  onToggle: (id: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const AmalCheckbox = ({ id, text, checked, onToggle, onEdit, onDelete }: AmalCheckboxProps) => {
  return (
    <div
      className={cn(
        "w-full flex items-center gap-3 p-4 rounded-lg border transition-all duration-300 group",
        checked
          ? "bg-primary/5 border-primary/30 shadow-sm"
          : "bg-card border-border hover:border-primary/30 hover:shadow-soft"
      )}
    >
      <button
        onClick={() => onToggle(id)}
        className="flex-1 flex items-center gap-3 text-left"
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
            "text-sm font-medium transition-all duration-300",
            checked
              ? "text-muted-foreground line-through"
              : "text-foreground"
          )}
        >
          {text}
        </span>
      </button>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onEdit}
        >
          <Edit2 className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
