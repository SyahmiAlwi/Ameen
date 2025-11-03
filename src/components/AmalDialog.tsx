import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Amal, PrayerTime } from '@/types';
import { PRAYER_TIMES } from '@/constants/amalan';

interface AmalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (amal: Amal) => void;
  editingAmal?: Amal | null;
  defaultCategory?: PrayerTime;
}

export const AmalDialog = ({ open, onOpenChange, onSave, editingAmal, defaultCategory }: AmalDialogProps) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<PrayerTime>(defaultCategory || 'Fajr');

  useEffect(() => {
    if (editingAmal) {
      setText(editingAmal.text);
      setCategory(editingAmal.category);
    } else {
      setText('');
      setCategory(defaultCategory || 'Fajr');
    }
  }, [editingAmal, defaultCategory, open]);

  const handleSave = () => {
    if (!text.trim()) return;

    const amal: Amal = {
      id: editingAmal?.id || `amal_${Date.now()}`,
      text: text.trim(),
      category,
    };

    onSave(amal);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingAmal ? 'Edit Amal' : 'Add New Amal'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="text">Practice Name</Label>
            <Input
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., Surah Al-Mulk"
              autoFocus
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Prayer Time</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as PrayerTime)}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRAYER_TIMES.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!text.trim()}>
            {editingAmal ? 'Save Changes' : 'Add Amal'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
