import { useEffect, useCallback } from 'react';

interface KeyboardActions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onFlip?: () => void;
  onEscape?: () => void;
  enabled?: boolean;
}

/**
 * Hook for keyboard navigation in the flashcard app
 * - Arrow Left / A: Swipe card left (next)
 * - Arrow Right / D: Swipe card right (previous)
 * - Space / Enter: Flip card
 * - Escape: Close drawer / Go back
 */
export function useKeyboard({
  onSwipeLeft,
  onSwipeRight,
  onFlip,
  onEscape,
  enabled = true,
}: KeyboardActions): void {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          event.preventDefault();
          onSwipeLeft?.();
          break;

        case 'ArrowRight':
        case 'd':
        case 'D':
          event.preventDefault();
          onSwipeRight?.();
          break;

        case ' ':
        case 'Enter':
          event.preventDefault();
          onFlip?.();
          break;

        case 'Escape':
          event.preventDefault();
          onEscape?.();
          break;

        default:
          break;
      }
    },
    [enabled, onSwipeLeft, onSwipeRight, onFlip, onEscape]
  );

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown]);
}

export default useKeyboard;
