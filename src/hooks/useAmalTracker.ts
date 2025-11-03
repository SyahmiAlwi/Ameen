import { useState, useEffect, useCallback } from 'react';
import { DailyProgress, Amal } from '@/types';
import { AMALAN_LIST } from '@/constants/amalan';

const getTodayKey = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

const AMALAN_STORAGE_KEY = 'custom_amalan_list';

export const useAmalTracker = () => {
  const [amalanList, setAmalanList] = useState<Amal[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load amalan list and progress from localStorage
  useEffect(() => {
    // Load custom amalan list or use default
    const storedList = localStorage.getItem(AMALAN_STORAGE_KEY);
    if (storedList) {
      try {
        setAmalanList(JSON.parse(storedList));
      } catch (error) {
        console.error('Error loading amalan list:', error);
        setAmalanList(AMALAN_LIST);
      }
    } else {
      setAmalanList(AMALAN_LIST);
    }

    // Load today's progress
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

  // Save amalan list to localStorage
  const saveAmalanList = useCallback((list: Amal[]) => {
    localStorage.setItem(AMALAN_STORAGE_KEY, JSON.stringify(list));
    setAmalanList(list);
  }, []);

  // Save progress to localStorage
  const saveProgress = useCallback((completedItems: string[]) => {
    const todayKey = getTodayKey();
    const percentage = Math.round((completedItems.length / amalanList.length) * 100);
    
    const progress: DailyProgress = {
      date: todayKey,
      completed: completedItems,
      percentage,
    };
    
    localStorage.setItem(`amalan_${todayKey}`, JSON.stringify(progress));
  }, [amalanList.length]);

  const toggleAmal = useCallback((id: string) => {
    setCompleted(prev => {
      const newCompleted = prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id];
      
      saveProgress(newCompleted);
      return newCompleted;
    });
  }, [saveProgress]);

  const addAmal = useCallback((amal: Amal) => {
    const newList = [...amalanList, amal];
    saveAmalanList(newList);
  }, [amalanList, saveAmalanList]);

  const updateAmal = useCallback((id: string, updatedAmal: Amal) => {
    const newList = amalanList.map(item => item.id === id ? updatedAmal : item);
    saveAmalanList(newList);
  }, [amalanList, saveAmalanList]);

  const deleteAmal = useCallback((id: string) => {
    const newList = amalanList.filter(item => item.id !== id);
    saveAmalanList(newList);
    // Remove from completed if it was checked
    setCompleted(prev => {
      const newCompleted = prev.filter(itemId => itemId !== id);
      saveProgress(newCompleted);
      return newCompleted;
    });
  }, [amalanList, saveAmalanList, saveProgress]);

  const resetDay = useCallback(() => {
    setCompleted([]);
    const todayKey = getTodayKey();
    localStorage.removeItem(`amalan_${todayKey}`);
  }, []);

  const percentage = amalanList.length > 0 
    ? Math.round((completed.length / amalanList.length) * 100) 
    : 0;

  return {
    amalanList,
    completed,
    toggleAmal,
    addAmal,
    updateAmal,
    deleteAmal,
    resetDay,
    percentage,
    isLoading,
    totalItems: amalanList.length,
    completedCount: completed.length,
  };
};
