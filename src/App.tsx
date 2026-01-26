import { useState } from 'react';
import CardStack from './components/CardStack';
import LanguageDrawer from './components/LanguageDrawer';
import { useCategories, useFlashcards } from './hooks';
import type { AppView, Region } from './types';
import './App.css';

// ============================================
// Loading Spinner Component
// ============================================

function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <p>{message}</p>
    </div>
  );
}

// ============================================
// Error Banner Component
// ============================================

function ErrorBanner({
  error,
  onRetry,
}: {
  error: Error;
  onRetry?: () => void;
}) {
  return (
    <div className="error-banner">
      <p className="error-message">{error.message}</p>
      {onRetry && (
        <button className="retry-button" onClick={onRetry} type="button">
          Try Again
        </button>
      )}
    </div>
  );
}

// ============================================
// Language Selector Component
// ============================================

interface LanguageSelectorProps {
  onSelectLanguage: (code: string) => void;
}

function LanguageSelector({ onSelectLanguage }: LanguageSelectorProps) {
  const { regions, loading, error, refetch } = useCategories();

  if (loading) {
    return <LoadingSpinner message="Loading languages..." />;
  }

  if (error) {
    return <ErrorBanner error={error} onRetry={refetch} />;
  }

  if (!regions) {
    return <ErrorBanner error={new Error('No languages available')} />;
  }

  return (
    <div className="language-selector">
      <h1 className="selector-title">Learn Numbers</h1>
      <p className="selector-subtitle">Choose a language to start learning</p>

      <div className="regions-container">
        {regions.map((region) => (
          <div key={region.id} className="region-group">
            <h2 className="region-title">{region.name}</h2>
            <div className="language-grid">
              {region.languages.map((lang) => (
                <button
                  key={lang.code}
                  className="language-button"
                  onClick={() => onSelectLanguage(lang.code)}
                  type="button"
                >
                  <span className="language-flag">{lang.flag}</span>
                  <span className="language-name">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// Flashcard View Component
// ============================================

interface FlashcardViewProps {
  langCode: string;
  regions: Region[];
  onBack: () => void;
  onSelectLanguage: (langCode: string) => void;
}

function FlashcardView({ langCode, regions, onBack, onSelectLanguage }: FlashcardViewProps) {
  const { cards, languageName, loading, error, refetch } = useFlashcards(langCode);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  if (loading) {
    return <LoadingSpinner message={`Loading ${langCode} flashcards...`} />;
  }

  if (error) {
    return (
      <div className="error-container">
        <ErrorBanner error={error} onRetry={refetch} />
        <button className="back-link" onClick={onBack} type="button">
          ← Back to languages
        </button>
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="error-container">
        <ErrorBanner error={new Error('No flashcards available')} />
        <button className="back-link" onClick={onBack} type="button">
          ← Back to languages
        </button>
      </div>
    );
  }

  return (
    <>
      <CardStack
        cards={cards}
        languageName={languageName ?? langCode}
        langCode={langCode}
        onBack={onBack}
        onMenuClick={() => setIsDrawerOpen(true)}
      />
      <LanguageDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        regions={regions}
        currentLangCode={langCode}
        onSelectLanguage={onSelectLanguage}
      />
    </>
  );
}

// ============================================
// Main App Component
// ============================================

export default function App() {
  const [view, setView] = useState<AppView>('selector');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const { regions } = useCategories();

  const handleSelectLanguage = (langCode: string): void => {
    setSelectedLanguage(langCode);
    setView('cards');
  };

  const handleBack = (): void => {
    setView('selector');
    setSelectedLanguage(null);
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main id="main-content" className="app">
        {view === 'selector' && (
          <LanguageSelector onSelectLanguage={handleSelectLanguage} />
        )}

        {view === 'cards' && selectedLanguage && regions && (
          <FlashcardView
            langCode={selectedLanguage}
            regions={regions}
            onBack={handleBack}
            onSelectLanguage={handleSelectLanguage}
          />
        )}
      </main>
    </>
  );
}
