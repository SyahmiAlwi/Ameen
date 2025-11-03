import { useState } from 'react';
import { useAmalTracker } from '@/hooks/useAmalTracker';
import { PRAYER_TIMES } from '@/constants/amalan';
import { Header } from '@/components/Header';
import { ProgressRing } from '@/components/ProgressRing';
import { PrayerSection } from '@/components/PrayerSection';
import { AmalDialog } from '@/components/AmalDialog';
import { Separator } from '@/components/ui/separator';
import { Amal, PrayerTime } from '@/types';
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
      deleteAmal(amalToDelete);
      toast({
        title: "Deleted",
        description: "Amal has been removed successfully.",
      });
      setAmalToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Amal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this amal? This action cannot be undone.
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
