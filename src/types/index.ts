// ============================================
// Flashcard Data Types
// ============================================

/**
 * Individual flashcard representing a number in a language
 */
export interface FlashCard {
  number: number;
  word: string;
  pronunciation: string;
  image: string;
  placeholderImage?: string;
}

/**
 * Language data with all its flashcards
 */
export interface LanguageData {
  code: string;
  name: string;
  region: string;
  cards: FlashCard[];
}

/**
 * Language entry in the category list
 */
export interface Language {
  code: string;
  name: string;
  flag: string;
  region?: string;
  regionId?: string;
}

/**
 * Region grouping of languages
 */
export interface Region {
  id: string;
  name: string;
  languages: Language[];
}

/**
 * Categories response structure
 */
export interface CategoriesResponse {
  regions: Region[];
}

// ============================================
// API Error Types
// ============================================

/**
 * Error codes for API failures
 */
export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  PARSE_ERROR = 'PARSE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Custom fetch error with additional metadata
 */
export interface FetchErrorData {
  message: string;
  status: number | null;
  code: ErrorCode;
}

// ============================================
// API Configuration Types
// ============================================

/**
 * API configuration options
 */
export interface APIConfig {
  BASE_URL: string;
  TIMEOUT: number;
  RETRY_ATTEMPTS: number;
  RETRY_DELAY: number;
}

// ============================================
// Hook Return Types
// ============================================

/**
 * Return type for useCategories hook
 */
export interface UseCategoriesReturn {
  categories: Language[] | null;
  regions: Region[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Return type for useFlashcards hook
 */
export interface UseFlashcardsReturn {
  flashcards: LanguageData | null;
  cards: FlashCard[] | null;
  languageName: string | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// ============================================
// Component Props Types
// ============================================

/**
 * Props for individual Card component
 */
export interface CardProps {
  card: FlashCard;
  style: React.CSSProperties & {
    zIndex: number;
    scale: number;
    y: number;
    opacity: number;
  };
  onSwipe: (number: number) => void;
  active: boolean;
}

/**
 * Props for CardStack component
 */
export interface CardStackProps {
  cards: FlashCard[];
  languageName: string;
  onBack?: () => void;
}

/**
 * Props for LanguageSelector component
 */
export interface LanguageSelectorProps {
  regions: Region[];
  onSelectLanguage: (langCode: string) => void;
  loading?: boolean;
}

/**
 * Props for FlashCard component (with flip)
 */
export interface FlashCardProps {
  card: FlashCard;
  isFlipped: boolean;
  onFlip: () => void;
}

/**
 * Props for ErrorBanner component
 */
export interface ErrorBannerProps {
  error: Error | null;
  onRetry?: () => void;
  onDismiss?: () => void;
}

/**
 * Props for LoadingSpinner component
 */
export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

// ============================================
// App State Types
// ============================================

/**
 * View states for the application
 */
export type AppView = 'selector' | 'cards';

/**
 * Application state
 */
export interface AppState {
  view: AppView;
  selectedLanguage: string | null;
}
