import { useState, useCallback, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
  type MotionValue,
} from 'motion/react';
import { useKeyboard, useProgress } from '../hooks';
import type { FlashCard } from '../types';
import './CardStack.css';

// ============================================
// Types
// ============================================

interface CardStyleProps {
  zIndex: number;
  scale: number;
  y: number;
  opacity: number;
}

interface CardComponentProps {
  card: FlashCard;
  style: CardStyleProps;
  onSwipe: (number: number, direction: 'left' | 'right') => void;
  onFlip: () => void;
  active: boolean;
  isFlipped: boolean;
  xMotion: MotionValue<number>;
}

interface CardStackComponentProps {
  cards?: FlashCard[];
  languageName?: string;
  langCode?: string;
  onBack?: () => void;
  onMenuClick?: () => void;
}

// ============================================
// Demo Data (for standalone testing)
// ============================================

const demoCards: FlashCard[] = Array.from({ length: 10 }, (_, i) => ({
  number: i + 1,
  word: `Word ${i + 1}`,
  pronunciation: `pronunciation ${i + 1}`,
  image: `/images/demo/${i + 1}.jpg`,
  placeholderImage: `https://picsum.photos/seed/demo-${i + 1}/300/400`,
}));

// ============================================
// Card Component
// ============================================

function Card({
  card,
  style,
  onSwipe,
  onFlip,
  active,
  isFlipped,
  xMotion,
}: CardComponentProps) {
  const rotate = useTransform(xMotion, [-200, 200], [-25, 25]);
  const dragOpacity = useTransform(
    xMotion,
    [-200, -100, 0, 100, 200],
    [0.5, 1, 1, 1, 0.5]
  );

  const [imageError, setImageError] = useState<boolean>(false);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ): void => {
    const threshold = 100;
    if (
      Math.abs(info.offset.x) > threshold ||
      Math.abs(info.velocity.x) > 500
    ) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      const exitX = info.offset.x > 0 ? 300 : -300;
      animate(xMotion, exitX, {
        duration: 0.3,
        onComplete: () => {
          onSwipe(card.number, direction);
          xMotion.set(0);
        },
      });
    } else {
      animate(xMotion, 0, { type: 'spring', stiffness: 500, damping: 30 });
    }
  };

  const handleTap = (): void => {
    if (active) {
      onFlip();
    }
  };

  const handleImageError = (): void => {
    setImageError(true);
  };

  // Use placeholder if real image fails
  const backgroundImage =
    imageError || !card.image ? card.placeholderImage : card.image;

  return (
    <motion.div
      className={`card ${isFlipped ? 'flipped' : ''}`}
      style={{
        zIndex: style.zIndex,
        scale: style.scale,
        y: style.y,
        x: xMotion,
        rotate,
        opacity: active ? dragOpacity : style.opacity,
      }}
      drag={active ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      onTap={handleTap}
      whileTap={active ? { cursor: 'grabbing' } : {}}
    >
      <div className="card-inner">
        {/* Front of card */}
        <div
          className="card-front"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <img
            src={card.image}
            alt=""
            style={{ display: 'none' }}
            onError={handleImageError}
          />
          <div className="card-number">{card.number}</div>
          <div className="card-hint">Tap to flip • Arrow keys to navigate</div>
        </div>

        {/* Back of card */}
        <div
          className="card-back"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="card-word">{card.word}</div>
          <div className="card-pronunciation">{card.pronunciation}</div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// CardStack Component
// ============================================

export default function CardStack({
  cards: propCards,
  languageName = 'Demo',
  langCode,
  onBack,
  onMenuClick,
}: CardStackComponentProps) {
  // Use provided cards or demo cards
  const initialCards = propCards ?? demoCards;

  // Progress persistence
  const { currentIndex: savedIndex, cardOrder, updateProgress, resetProgress, hasProgress } = useProgress(langCode ?? null);

  // Initialize cards with saved order if available
  const getInitialCards = useCallback((): FlashCard[] => {
    if (hasProgress && cardOrder.length === initialCards.length) {
      return cardOrder.map((num) => initialCards.find((c) => c.number === num)!);
    }
    return [...initialCards];
  }, [initialCards, cardOrder, hasProgress]);

  const [cards, setCards] = useState<FlashCard[]>(getInitialCards);
  const [currentIndex, setCurrentIndex] = useState<number>(hasProgress ? savedIndex : 0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Motion value for the top card's x position
  const xMotion = useMotionValue(0);
  const staticXMotion = useMotionValue(0); // For non-active cards
  const isAnimating = useRef(false);

  const handleSwipe = useCallback(
    (_number: number, _direction: 'left' | 'right'): void => {
      setCards((prev) => {
        const newCards = [...prev];
        const [removed] = newCards.splice(0, 1);
        newCards.push(removed);

        // Save progress
        const newIndex = (currentIndex + 1) % initialCards.length;
        const newOrder = newCards.map((c) => c.number);
        updateProgress(newIndex, newOrder);

        return newCards;
      });
      setCurrentIndex((prev) => (prev + 1) % initialCards.length);
      setIsFlipped(false);
      isAnimating.current = false;
    },
    [initialCards.length, currentIndex, updateProgress]
  );

  const handleFlip = useCallback((): void => {
    setIsFlipped((prev) => !prev);
  }, []);

  // Programmatic swipe for keyboard navigation
  const triggerSwipe = useCallback(
    (direction: 'left' | 'right'): void => {
      if (isAnimating.current) return;
      isAnimating.current = true;

      const exitX = direction === 'left' ? -300 : 300;
      animate(xMotion, exitX, {
        duration: 0.3,
        onComplete: () => {
          handleSwipe(cards[0].number, direction);
          xMotion.set(0);
        },
      });
    },
    [cards, handleSwipe, xMotion]
  );

  // Keyboard navigation
  useKeyboard({
    onSwipeLeft: () => triggerSwipe('left'),
    onSwipeRight: () => triggerSwipe('right'),
    onFlip: handleFlip,
    onEscape: onBack,
    enabled: true,
  });

  return (
    <div className="card-stack-container">
      <header className="card-stack-header">
        {onMenuClick && (
          <button
            className="menu-button"
            onClick={onMenuClick}
            type="button"
            aria-label="Open language menu"
          >
            <span className="menu-icon">☰</span>
          </button>
        )}
        <h1 className="title">{languageName}</h1>
        {onBack && (
          <button className="back-button" onClick={onBack} type="button">
            ← Back
          </button>
        )}
      </header>

      <p className="subtitle">Drag or use arrow keys • Space to flip</p>

      <div className="card-stack" role="region" aria-label="Flashcard stack">
        {cards.map((card, index) => {
          const isTop = index === 0;
          const stackIndex = Math.min(index, 4);

          return (
            <Card
              key={card.number}
              card={card}
              active={isTop}
              isFlipped={isTop ? isFlipped : false}
              onSwipe={handleSwipe}
              onFlip={handleFlip}
              xMotion={isTop ? xMotion : staticXMotion}
              style={{
                zIndex: cards.length - index,
                scale: 1 - stackIndex * 0.05,
                y: stackIndex * 10,
                opacity: index < 5 ? 1 - stackIndex * 0.15 : 0,
              }}
            />
          );
        })}
      </div>

      <div className="progress-container">
        <div className="progress-info">
          <p className="card-count">
            Card {currentIndex + 1} of {initialCards.length}
          </p>
          {hasProgress && (
            <button
              className="reset-button"
              onClick={() => {
                resetProgress();
                setCards([...initialCards]);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              type="button"
              aria-label="Reset progress"
            >
              ↺ Reset
            </button>
          )}
        </div>
        <div className="progress-bar" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={initialCards.length}>
          <div
            className="progress-fill"
            style={{
              width: `${((currentIndex + 1) / initialCards.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="keyboard-hint">
        <kbd>←</kbd> <kbd>→</kbd> Navigate • <kbd>Space</kbd> Flip • <kbd>Esc</kbd> Back
      </div>
    </div>
  );
}
