import { useState, useEffect } from 'react';
import { useAmalTracker } from '@/hooks/useAmalTracker';
import { useStreakTracker } from '@/hooks/useStreakTracker';
import { PRAYER_TIMES } from '@/constants/amalan';
import { Header } from '@/components/Header';
import { ProgressRing } from '@/components/ProgressRing';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { PrayerSection } from '@/components/PrayerSection';
import { AmalDialog } from '@/components/AmalDialog';
import { StreakCounter } from '@/components/StreakCounter';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Amal, PrayerTime } from '@/types';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { 
    amalanList, 
    completed, 
    toggleAmal, 
    addAmal, 
    updateAmal, 
    deleteAmal, 
    resetDay, 
    percentage, 
    isLoading, 
    completedCount, 
    totalItems 
  } = useAmalTracker();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAmal, setEditingAmal] = useState<Amal | null>(null);
  const [defaultCategory, setDefaultCategory] = useState<PrayerTime | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [amalToDelete, setAmalToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentStreak, longestStreak, totalDays, refreshStreaks } = useStreakTracker();

  // Refresh streaks when completion changes
  useEffect(() => {
    refreshStreaks();
  }, [completed, refreshStreaks]);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleAddClick = (category: PrayerTime) => {
    setEditingAmal(null);
    setDefaultCategory(category);
    setDialogOpen(true);
  };

  // Determine current prayer time for quick add
  const getCurrentPrayer = (): PrayerTime => {
    const hour = new Date().getHours();
    if (hour < 6) return 'Fajr';
    if (hour < 13) return 'Dhuhr';
    if (hour < 17) return 'Asar';
    if (hour < 20) return 'Maghrib';
    return 'Isyak';
  };

  const handleEditClick = (amal: Amal) => {
    setEditingAmal(amal);
    setDefaultCategory(undefined);
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setAmalToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleSaveAmal = (amal: Amal) => {
    if (editingAmal) {
      updateAmal(amal.id, amal);
      toast({
        title: "Updated",
        description: "Amal has been updated successfully.",
      });
    } else {
      addAmal(amal);
      toast({
        title: "Added",
        description: "New amal has been added successfully.",
      });
    }
  };

  const handleConfirmDelete = () => {
    if (amalToDelete) {
      const deleted = amalanList.find(a => a.id === amalToDelete) || null;
      deleteAmal(amalToDelete);
      toast({
        title: "Deleted",
        description: deleted ? `Removed: ${deleted.text}` : "Amal has been removed.",
        action: (
          <Button
            onClick={() => {
              if (deleted) addAmal(deleted);
            }}
          >Undo</Button>
        )
      });
      setAmalToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onReset={resetDay} date={today} />
        <main className="container max-w-3xl mx-auto px-4 py-8 space-y-8">
          <div className="grid grid-cols-1 gap-4">
            <div className="h-28 rounded-lg bg-muted animate-pulse" />
            <div className="h-12 rounded-lg bg-muted animate-pulse" />
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-6 w-40 rounded bg-muted animate-pulse" />
                <div className="h-14 rounded-lg bg-muted animate-pulse" />
                <div className="h-14 rounded-lg bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onReset={resetDay} date={today} />
      
      <main className="container max-w-3xl mx-auto px-4 py-8">

        {/* Progress + Streak Card */}
        <div className="mb-8 grid grid-cols-1 gap-4">
          <div className="rounded-xl border bg-card shadow-card p-4 flex items-center gap-6">
            <div className="shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <ProgressRing percentage={percentage} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <span>{totalItems - completedCount} remaining</span>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-lg font-semibold">{completedCount} of {totalItems} practices</p>
              <p className="text-sm text-muted-foreground">Keep going, you’re doing great.</p>
              <div className="mt-2">
                <StreakCounter 
                  currentStreak={currentStreak}
                  longestStreak={longestStreak}
                  totalDays={totalDays}
                />
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Prayer Sections */}
        <div className="space-y-8">
          {PRAYER_TIMES.map((prayerTime, index) => {
            const items = amalanList.filter(amal => amal.category === prayerTime);
            
            return (
              <div key={prayerTime} style={{ animationDelay: `${index * 100}ms` }}>
                <PrayerSection
                  prayerTime={prayerTime}
                  items={items}
                  completed={completed}
                  onToggle={toggleAmal}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  onAdd={handleAddClick}
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

      <AmalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveAmal}
        editingAmal={editingAmal}
        defaultCategory={defaultCategory}
      />

      {/* Floating Quick Add Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          size="lg"
          className="rounded-full shadow-card h-12 w-12 p-0"
          onClick={() => handleAddClick(getCurrentPrayer())}
          aria-label="Quick add amal"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Amal</AlertDialogTitle>
            <AlertDialogDescription>
              {(() => {
                const item = amalanList.find(a => a.id === amalToDelete);
                return item ? `Delete "${item.text}"? This action cannot be undone.` :
                  'Are you sure you want to delete this amal? This action cannot be undone.';
              })()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
