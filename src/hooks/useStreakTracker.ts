import { useState, useEffect } from 'react';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  lastCompletedDate: string | null;
}

export const useStreakTracker = () => {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    totalDays: 0,
    lastCompletedDate: null,
  });

  useEffect(() => {
    calculateStreaks();
  }, []);

  const calculateStreaks = () => {
    const allKeys = Object.keys(localStorage).filter(key => key.startsWith('amalan_'));
    
    if (allKeys.length === 0) {
      setStreakData({
        currentStreak: 0,
        longestStreak: 0,
        totalDays: 0,
        lastCompletedDate: null,
      });
      return;
    }

    // Parse dates and sort them
    const dates = allKeys
      .map(key => {
        const dateStr = key.replace('amalan_', '');
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        return {
          date: dateStr,
          percentage: data.percentage || 0,
          completed: data.completed?.length || 0,
        };
      })
      .filter(d => d.percentage >= 80) // Consider day complete if 80% or more done
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (dates.length === 0) {
      setStreakData({
        currentStreak: 0,
        longestStreak: 0,
        totalDays: 0,
        lastCompletedDate: null,
      });
      return;
    }

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayStr = formatDate(today);
    const yesterdayStr = formatDate(yesterday);

    // Check if today or yesterday is in the completed dates
    const lastDate = dates[dates.length - 1].date;
    
    if (lastDate === todayStr || lastDate === yesterdayStr) {
      currentStreak = 1;
      let checkDate = new Date(lastDate);
      
      for (let i = dates.length - 2; i >= 0; i--) {
        const prevDate = new Date(dates[i].date);
        checkDate.setDate(checkDate.getDate() - 1);
        
        if (formatDate(checkDate) === dates[i].date) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 1;

    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1].date);
      const currDate = new Date(dates[i].date);
      
      const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    setStreakData({
      currentStreak,
      longestStreak,
      totalDays: dates.length,
      lastCompletedDate: dates[dates.length - 1].date,
    });
  };

  const formatDate = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  return {
    ...streakData,
    refreshStreaks: calculateStreaks,
  };
};
