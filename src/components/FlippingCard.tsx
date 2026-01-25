// components/FlippingCard/FlippingCard.tsx
import React, { useState, useRef, useEffect } from 'react';
import styles from './FlippingCard.module.css';

interface FlippingCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  className?: string;
}

const FlippingCard: React.FC<FlippingCardProps> = ({ 
  frontContent, 
  backContent, 
  className = '' 
}) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const backRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFlip = (): void => {
    setIsFlipped(!isFlipped);
  };

  // Set container height based on back content when flipped
  useEffect(() => {
    const updateHeight = () => {
      if (backRef.current && containerRef.current) {
        if (isFlipped) {
          // When flipped, use back content height
          const backHeight = backRef.current.scrollHeight;
          containerRef.current.style.minHeight = `${Math.max(backHeight, 200)}px`;
        } else {
          // When not flipped, use fixed front height
          containerRef.current.style.minHeight = '200px';
        }
      }
    };

    updateHeight();

    // Update height when window resizes or content changes
    window.addEventListener('resize', updateHeight);
    
    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, [isFlipped, backContent]);

  return (
    <div 
      ref={containerRef}
      className={`${styles.cardContainer} ${className} ${isFlipped ? styles.flipped : ''}`} 
      onClick={handleFlip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleFlip();
        }
      }}
    >
      <div className={styles.cardInner}>
        <div className={styles.cardFront}>
          {frontContent}
        </div>
        <div ref={backRef} className={styles.cardBack}>
          {backContent}
        </div>
      </div>
    </div>
  );
};

export default FlippingCard;