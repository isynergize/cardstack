import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'flashcard-progress';

interface LanguageProgress {
  currentIndex: number;
  cardOrder: number[];
  lastVisited: string;
}

interface AllProgress {
  [langCode: string]: LanguageProgress;
}

interface UseProgressReturn {
  currentIndex: number;
  cardOrder: number[];
  updateProgress: (index: number, order: number[]) => void;
  resetProgress: () => void;
  hasProgress: boolean;
}

/**
 * Hook for persisting flashcard progress to localStorage
 * Saves current card index and card order per language
 */
export function useProgress(langCode: string | null): UseProgressReturn {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [cardOrder, setCardOrder] = useState<number[]>([]);
  const [hasProgress, setHasProgress] = useState<boolean>(false);

  // Load progress from localStorage
  useEffect(() => {
    if (!langCode) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const allProgress: AllProgress = JSON.parse(stored);
        const langProgress = allProgress[langCode];

        if (langProgress) {
          setCurrentIndex(langProgress.currentIndex);
          setCardOrder(langProgress.cardOrder);
          setHasProgress(true);
        } else {
          setCurrentIndex(0);
          setCardOrder([]);
          setHasProgress(false);
        }
      }
    } catch (error) {
      console.warn('Failed to load progress from localStorage:', error);
      setCurrentIndex(0);
      setCardOrder([]);
      setHasProgress(false);
    }
  }, [langCode]);

  // Save progress to localStorage
  const updateProgress = useCallback(
    (index: number, order: number[]): void => {
      if (!langCode) return;

      setCurrentIndex(index);
      setCardOrder(order);
      setHasProgress(true);

      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const allProgress: AllProgress = stored ? JSON.parse(stored) : {};

        allProgress[langCode] = {
          currentIndex: index,
          cardOrder: order,
          lastVisited: new Date().toISOString(),
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
      } catch (error) {
        console.warn('Failed to save progress to localStorage:', error);
      }
    },
    [langCode]
  );

  // Reset progress for current language
  const resetProgress = useCallback((): void => {
    if (!langCode) return;

    setCurrentIndex(0);
    setCardOrder([]);
    setHasProgress(false);

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const allProgress: AllProgress = JSON.parse(stored);
        delete allProgress[langCode];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
      }
    } catch (error) {
      console.warn('Failed to reset progress in localStorage:', error);
    }
  }, [langCode]);

  return {
    currentIndex,
    cardOrder,
    updateProgress,
    resetProgress,
    hasProgress,
  };
}

/**
 * Get all saved progress (for displaying on language selector)
 */
export function getAllProgress(): AllProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Clear all saved progress
 */
export function clearAllProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear all progress:', error);
  }
}

export default useProgress;
