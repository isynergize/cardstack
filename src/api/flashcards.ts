import config from './config';
import { ErrorCode } from '../types';
import type { CategoriesResponse, LanguageData } from '../types';

/**
 * Custom error class for API fetch errors
 */
export class FetchError extends Error {
  public status: number | null;
  public code: ErrorCode;

  constructor(
    message: string,
    status: number | null = null,
    code: ErrorCode = ErrorCode.UNKNOWN_ERROR
  ) {
    super(message);
    this.name = 'FetchError';
    this.status = status;
    this.code = code;

    // Ensures prototype chain is correct
    Object.setPrototypeOf(this, FetchError.prototype);
  }
}

/**
 * Re-export ErrorCode for convenience
 */
export { ErrorCode };

/**
 * Fetch with timeout support
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> {
  const { timeout = config.TIMEOUT, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Core fetch function with error handling
 */
async function fetchJSON<T>(endpoint: string): Promise<T> {
  const url = `${config.BASE_URL}/${endpoint}`;

  try {
    const response = await fetchWithTimeout(url);

    // Handle HTTP errors
    if (!response.ok) {
      if (response.status === 404) {
        throw new FetchError(
          `Resource not found: ${endpoint}`,
          404,
          ErrorCode.NOT_FOUND
        );
      }
      if (response.status >= 500) {
        throw new FetchError(
          `Server error: ${response.statusText}`,
          response.status,
          ErrorCode.SERVER_ERROR
        );
      }
      throw new FetchError(
        `HTTP error: ${response.statusText}`,
        response.status,
        ErrorCode.UNKNOWN_ERROR
      );
    }

    // Parse JSON response
    try {
      const data = (await response.json()) as T;
      return data;
    } catch {
      throw new FetchError(
        'Failed to parse response as JSON',
        null,
        ErrorCode.PARSE_ERROR
      );
    }
  } catch (error) {
    // Handle abort (timeout)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new FetchError(
        `Request timed out after ${config.TIMEOUT}ms`,
        null,
        ErrorCode.TIMEOUT_ERROR
      );
    }

    // Handle network errors
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new FetchError(
        'Network error: Unable to connect to server',
        null,
        ErrorCode.NETWORK_ERROR
      );
    }

    // Re-throw FetchError as-is
    if (error instanceof FetchError) {
      throw error;
    }

    // Wrap unknown errors
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    throw new FetchError(message, null, ErrorCode.UNKNOWN_ERROR);
  }
}

/**
 * Fetch with retry logic
 */
async function fetchWithRetry<T>(
  endpoint: string,
  attempts: number = config.RETRY_ATTEMPTS
): Promise<T> {
  let lastError: FetchError | undefined;

  for (let i = 0; i < attempts; i++) {
    try {
      return await fetchJSON<T>(endpoint);
    } catch (error) {
      if (error instanceof FetchError) {
        lastError = error;

        // Don't retry on 404s or parse errors
        if (
          error.code === ErrorCode.NOT_FOUND ||
          error.code === ErrorCode.PARSE_ERROR
        ) {
          throw error;
        }
      }

      // Wait before retrying (exponential backoff)
      if (i < attempts - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, config.RETRY_DELAY * Math.pow(2, i))
        );
      }
    }
  }

  throw lastError ?? new FetchError('Max retry attempts reached', null, ErrorCode.UNKNOWN_ERROR);
}

/**
 * Get all language categories
 * @returns Categories grouped by region
 */
export async function getCategories(): Promise<CategoriesResponse> {
  return fetchWithRetry<CategoriesResponse>('categories.json');
}

/**
 * Get flashcards for a specific language
 * @param langCode - Language code (e.g., 'haw', 'es', 'tl')
 * @returns Language data with cards
 */
export async function getFlashcards(langCode: string): Promise<LanguageData> {
  if (!langCode || typeof langCode !== 'string') {
    throw new FetchError(
      'Invalid language code provided',
      null,
      ErrorCode.UNKNOWN_ERROR
    );
  }

  return fetchWithRetry<LanguageData>(`${langCode.toLowerCase()}.json`);
}

/**
 * Get placeholder image URL for development
 * @param langCode - Language code
 * @param number - Card number (1-10)
 * @returns Placeholder image URL
 */
export function getPlaceholderImage(langCode: string, number: number): string {
  // Generate consistent placeholder based on lang + number
  const seed = `${langCode}-${number}`;
  return `https://picsum.photos/seed/${seed}/300/400`;
}
