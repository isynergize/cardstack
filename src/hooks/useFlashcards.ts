import { useState, useEffect, useCallback } from 'react';
import { getFlashcards, getPlaceholderImage, FetchError } from '../api/flashcards';
import type { LanguageData, FlashCard, UseFlashcardsReturn } from '../types';

/**
 * Hook to fetch and manage flashcards for a specific language
 * @param langCode - Language code to fetch (null to skip fetch)
 */
export function useFlashcards(langCode: string | null): UseFlashcardsReturn {
  const [data, setData] = useState<LanguageData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (): Promise<void> => {
    if (!langCode) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getFlashcards(langCode);

      // Add placeholder images if real images aren't available
      const cardsWithImages: FlashCard[] = result.cards.map((card) => ({
        ...card,
        placeholderImage: getPlaceholderImage(langCode, card.number),
      }));

      setData({
        ...result,
        cards: cardsWithImages,
      });
    } catch (err) {
      const fetchError = err instanceof FetchError
        ? err
        : new Error(err instanceof Error ? err.message : 'Unknown error');
      setError(fetchError);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [langCode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    flashcards: data,
    cards: data?.cards ?? null,
    languageName: data?.name ?? null,
    loading,
    error,
    refetch: fetchData,
  };
}

export default useFlashcards;
