import { Flame, Trophy, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
}

export const StreakCounter = ({ currentStreak, longestStreak, totalDays }: StreakCounterProps) => {
  const isOnFire = currentStreak >= 3;
  
  return (
    <div className="grid grid-cols-3 gap-3 mb-8">
      {/* Current Streak */}
      <div className={cn(
        "relative overflow-hidden rounded-xl p-4 transition-all duration-500",
        isOnFire 
          ? "bg-gradient-to-br from-accent/20 to-primary/20 border-2 border-accent/40 shadow-glow" 
          : "bg-card border border-border"
      )}>
        <div className="flex flex-col items-center gap-2">
          <div className={cn(
            "relative",
            isOnFire && "animate-pulse"
          )}>
            <Flame 
              className={cn(
                "w-8 h-8 transition-all duration-300",
                isOnFire ? "text-accent drop-shadow-[0_0_8px_rgba(250,180,80,0.6)]" : "text-muted-foreground"
              )} 
              fill={isOnFire ? "currentColor" : "none"}
            />
            {isOnFire && (
              <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full -z-10" />
            )}
          </div>
          <div className="text-center">
            <div className={cn(
              "text-2xl font-bold",
              isOnFire ? "text-accent" : "text-foreground"
            )}>
              {currentStreak}
            </div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>
        </div>
        {isOnFire && currentStreak >= 7 && (
          <div className="absolute top-1 right-1">
            <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded-full font-semibold">
              🔥 On Fire!
            </span>
          </div>
        )}
      </div>

      {/* Longest Streak */}
      <div className="rounded-xl p-4 bg-card border border-border">
        <div className="flex flex-col items-center gap-2">
          <Trophy className="w-8 h-8 text-primary" />
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{longestStreak}</div>
            <div className="text-xs text-muted-foreground">Best Streak</div>
          </div>
        </div>
      </div>

      {/* Total Days */}
      <div className="rounded-xl p-4 bg-card border border-border">
        <div className="flex flex-col items-center gap-2">
          <Calendar className="w-8 h-8 text-primary" />
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{totalDays}</div>
            <div className="text-xs text-muted-foreground">Total Days</div>
          </div>
        </div>
      </div>
    </div>
  );
};
