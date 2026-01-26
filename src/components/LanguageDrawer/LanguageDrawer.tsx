import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Region } from '../../types';
import './LanguageDrawer.css';

interface LanguageDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  regions: Region[];
  currentLangCode: string;
  onSelectLanguage: (langCode: string) => void;
}

export default function LanguageDrawer({
  isOpen,
  onClose,
  regions,
  currentLangCode,
  onSelectLanguage,
}: LanguageDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap and body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      drawerRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLanguageClick = (langCode: string) => {
    if (langCode !== currentLangCode) {
      onSelectLanguage(langCode);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            className="language-drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label="Language selection"
            tabIndex={-1}
          >
            <header className="drawer-header">
              <h2 className="drawer-title">Languages</h2>
              <button
                className="drawer-close"
                onClick={onClose}
                type="button"
                aria-label="Close language menu"
              >
                ✕
              </button>
            </header>

            <nav className="drawer-content">
              {regions.map((region) => (
                <div key={region.id} className="drawer-region">
                  <h3 className="drawer-region-title">{region.name}</h3>
                  <ul className="drawer-language-list">
                    {region.languages.map((lang) => (
                      <li key={lang.code}>
                        <button
                          className={`drawer-language-button ${
                            lang.code === currentLangCode ? 'active' : ''
                          }`}
                          onClick={() => handleLanguageClick(lang.code)}
                          type="button"
                          aria-current={lang.code === currentLangCode ? 'true' : undefined}
                        >
                          <span className="drawer-lang-flag">{lang.flag}</span>
                          <span className="drawer-lang-name">{lang.name}</span>
                          {lang.code === currentLangCode && (
                            <span className="drawer-lang-check" aria-hidden="true">✓</span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
