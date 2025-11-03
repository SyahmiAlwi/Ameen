import { useAmalTracker } from '@/hooks/useAmalTracker';
import { AMALAN_LIST, PRAYER_TIMES } from '@/constants/amalan';
import { Header } from '@/components/Header';
import { ProgressRing } from '@/components/ProgressRing';
import { PrayerSection } from '@/components/PrayerSection';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  const { completed, toggleAmal, resetDay, percentage, isLoading, completedCount, totalItems } = useAmalTracker();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onReset={resetDay} date={today} />
      
      <main className="container max-w-3xl mx-auto px-4 py-8">
        {/* Progress Section */}
        <div className="mb-10 flex flex-col items-center text-center space-y-4 animate-slide-up">
          <ProgressRing percentage={percentage} />
          <div>
            <p className="text-lg font-medium text-foreground">
              {completedCount} of {totalItems} practices
            </p>
            <p className="text-sm text-muted-foreground">Keep up the great work!</p>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Prayer Sections */}
        <div className="space-y-8">
          {PRAYER_TIMES.map((prayerTime, index) => {
            const items = AMALAN_LIST.filter(amal => amal.category === prayerTime);
            
            return (
              <div key={prayerTime} style={{ animationDelay: `${index * 100}ms` }}>
                <PrayerSection
                  prayerTime={prayerTime}
                  items={items}
                  completed={completed}
                  onToggle={toggleAmal}
                />
                
                {index < PRAYER_TIMES.length - 1 && (
                  <Separator className="mt-8" />
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center pb-8">
          <p className="text-sm text-muted-foreground">
            "Indeed, prayer has been decreed upon the believers a decree of specified times." 
            <br />
            <span className="text-xs">— Quran 4:103</span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
