import { RotateCcw, History, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
interface HeaderProps {
  onReset: () => void;
  date: string;
}
export const Header = ({
  onReset,
  date
}: HeaderProps) => {
  const { theme, setTheme } = useTheme();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const isDark = theme === 'dark';
  return <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container max-w-3xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-foreground">Ameen</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">PWA</span>
            </div>
            <p className="text-sm text-muted-foreground truncate">{date}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/history" aria-label="View history">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <History className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setConfirmOpen(true)} className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </div>
      </div>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset today’s progress?</AlertDialogTitle>
            <AlertDialogDescription>
              This will clear all completed practices for today. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { onReset(); setConfirmOpen(false); }}>Reset</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>;
};