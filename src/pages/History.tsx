import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, TrendingUp, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DayData {
  date: string;
  percentage: number;
  completed: string[];
}

const History = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [historyData, setHistoryData] = useState<Record<string, DayData>>({});
  const [selectedDayData, setSelectedDayData] = useState<DayData | null>(null);

  useEffect(() => {
    loadHistoryData();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const dateKey = formatDateKey(selectedDate);
      setSelectedDayData(historyData[dateKey] || null);
    }
  }, [selectedDate, historyData]);

  const loadHistoryData = () => {
    const allKeys = Object.keys(localStorage).filter(key => key.startsWith('amalan_'));
    const data: Record<string, DayData> = {};

    allKeys.forEach(key => {
      const dateStr = key.replace('amalan_', '');
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          data[dateStr] = JSON.parse(stored);
        }
      } catch (error) {
        console.error('Error loading history:', error);
      }
    });

    setHistoryData(data);
  };

  const formatDateKey = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const formatDisplayDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDayStatus = (date: Date) => {
    const dateKey = formatDateKey(date);
    const dayData = historyData[dateKey];
    
    if (!dayData) return null;
    
    if (dayData.percentage >= 80) return 'excellent';
    if (dayData.percentage >= 50) return 'good';
    return 'partial';
  };

  const calculateStats = () => {
    const dates = Object.values(historyData);
    const excellentDays = dates.filter(d => d.percentage >= 80).length;
    const goodDays = dates.filter(d => d.percentage >= 50 && d.percentage < 80).length;
    const totalPercentage = dates.reduce((sum, d) => sum + d.percentage, 0);
    const avgPercentage = dates.length > 0 ? Math.round(totalPercentage / dates.length) : 0;

    return { excellentDays, goodDays, avgPercentage, totalDays: dates.length };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onReset={() => {}} 
        date="Progress History" 
      />
      
      <main className="container max-w-5xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Daily Tracker
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.excellentDays}</div>
                <div className="text-xs text-muted-foreground">Excellent Days</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stats.goodDays}</div>
                <div className="text-xs text-muted-foreground">Good Days</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">{stats.avgPercentage}%</span>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Average</div>
                <div className="text-xs text-muted-foreground">Completion</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <span className="text-lg font-bold text-foreground">{stats.totalDays}</span>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Total</div>
                <div className="text-xs text-muted-foreground">Days</div>
              </div>
            </div>
          </Card>
        </div>

        <Separator className="mb-8" />

        {/* Calendar View */}
        <div className="grid md:grid-cols-[1fr,300px] gap-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Select a Date</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md"
              modifiers={{
                excellent: (date) => getDayStatus(date) === 'excellent',
                good: (date) => getDayStatus(date) === 'good',
                partial: (date) => getDayStatus(date) === 'partial',
              }}
              modifiersClassNames={{
                excellent: 'bg-primary/20 text-primary font-bold hover:bg-primary/30',
                good: 'bg-accent/20 text-accent font-bold hover:bg-accent/30',
                partial: 'bg-muted text-muted-foreground hover:bg-muted/80',
              }}
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-primary/20 border-2 border-primary/40"></div>
                <span className="text-xs text-muted-foreground">≥80% Complete</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-accent/20 border-2 border-accent/40"></div>
                <span className="text-xs text-muted-foreground">50-79% Complete</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-muted border-2 border-border"></div>
                <span className="text-xs text-muted-foreground">&lt;50% Complete</span>
              </div>
            </div>
          </Card>

          {/* Day Details */}
          <div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {selectedDate ? formatDisplayDate(selectedDate) : 'Select a date'}
              </h3>
              
              {selectedDayData ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Completion</span>
                    <Badge 
                      variant={selectedDayData.percentage >= 80 ? "default" : "secondary"}
                      className={cn(
                        selectedDayData.percentage >= 80 && "bg-primary/20 text-primary hover:bg-primary/30"
                      )}
                    >
                      {selectedDayData.percentage}%
                    </Badge>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-500 rounded-full",
                        selectedDayData.percentage >= 80 ? "bg-primary" : "bg-accent"
                      )}
                      style={{ width: `${selectedDayData.percentage}%` }}
                    />
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      {selectedDayData.percentage >= 80 ? (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      ) : (
                        <XCircle className="w-5 h-5 text-muted-foreground" />
                      )}
                      <span className="text-sm font-medium">
                        {selectedDayData.completed.length} practices completed
                      </span>
                    </div>
                    
                    {selectedDayData.percentage >= 80 ? (
                      <p className="text-sm text-muted-foreground">
                        Great work! You completed most of your daily practices.
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Keep going! Try to complete at least 80% of your practices.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground text-sm">
                    No data recorded for this day
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default History;
