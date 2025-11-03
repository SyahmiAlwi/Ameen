import { useState, useEffect, useCallback } from 'react';
import { DailyProgress } from '@/types';
import { AMALAN_LIST } from '@/constants/amalan';

const getTodayKey = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

export const useAmalTracker = () => {
  const [completed, setCompleted] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage
  useEffect(() => {
    const todayKey = getTodayKey();
    const stored = localStorage.getItem(`amalan_${todayKey}`);
    
    if (stored) {
      try {
        const data: DailyProgress = JSON.parse(stored);
        setCompleted(data.completed);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage
  const saveProgress = useCallback((completedItems: string[]) => {
    const todayKey = getTodayKey();
    const percentage = Math.round((completedItems.length / AMALAN_LIST.length) * 100);
    
    const progress: DailyProgress = {
      date: todayKey,
      completed: completedItems,
      percentage,
    };
    
    localStorage.setItem(`amalan_${todayKey}`, JSON.stringify(progress));
  }, []);

  const toggleAmal = useCallback((id: string) => {
    setCompleted(prev => {
      const newCompleted = prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id];
      
      saveProgress(newCompleted);
      return newCompleted;
    });
  }, [saveProgress]);

  const resetDay = useCallback(() => {
    setCompleted([]);
    const todayKey = getTodayKey();
    localStorage.removeItem(`amalan_${todayKey}`);
  }, []);

  const percentage = Math.round((completed.length / AMALAN_LIST.length) * 100);

  return {
    completed,
    toggleAmal,
    resetDay,
    percentage,
    isLoading,
    totalItems: AMALAN_LIST.length,
    completedCount: completed.length,
  };
};
