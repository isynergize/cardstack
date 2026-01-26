import { useState, useEffect, useCallback } from 'react';
import { getCategories, FetchError } from '../api/flashcards';
import type { Language, Region, UseCategoriesReturn } from '../types';

/**
 * Hook to fetch and manage language categories
 */
export function useCategories(): UseCategoriesReturn {
  const [regions, setRegions] = useState<Region[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const result = await getCategories();
      setRegions(result.regions);
    } catch (err) {
      const fetchError = err instanceof FetchError
        ? err
        : new Error(err instanceof Error ? err.message : 'Unknown error');
      setError(fetchError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Flatten all languages from all regions for easy access
  const allLanguages: Language[] | null = regions
    ? regions.flatMap((region) =>
        region.languages.map((lang) => ({
          ...lang,
          region: region.name,
          regionId: region.id,
        }))
      )
    : null;

  return {
    categories: allLanguages,
    regions,
    loading,
    error,
    refetch: fetchData,
  };
}

export default useCategories;
