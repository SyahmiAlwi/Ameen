import { RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
interface HeaderProps {
  onReset: () => void;
  date: string;
}
export const Header = ({
  onReset,
  date
}: HeaderProps) => {
  return <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container max-w-3xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Salam, Syahmi!</h1>
            <p className="text-sm text-muted-foreground">{date}</p>
          </div>
          
          <Button variant="outline" size="sm" onClick={onReset} className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30">
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </div>
    </header>;
};