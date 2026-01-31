import { useEffect } from 'react';

interface FloorClearOverlayProps {
  floor: number;
  isVictory: boolean;
  onComplete: () => void;
}

function FloorClearOverlay({ floor, isVictory, onComplete }: FloorClearOverlayProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="floor-clear-overlay">
      <div className="floor-clear-container">
        {/* Sparkle particles */}
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="sparkle-particle"
            style={{
              '--angle': `${i * 22.5}deg`,
              '--delay': `${i * 0.05}s`,
              '--distance': `${100 + Math.random() * 80}px`,
            } as React.CSSProperties}
          />
        ))}

        {/* Expanding rings */}
        <div className="clear-ring ring-1" />
        <div className="clear-ring ring-2" />

        {/* Central glow */}
        <div className="clear-glow" />
      </div>

      {/* Victory or Clear text */}
      <div className={`floor-clear-text ${isVictory ? 'victory' : ''}`}>
        {isVictory ? 'VICTORY!' : 'CLEAR!'}
      </div>

      {!isVictory && (
        <div className="floor-clear-subtext">Floor {floor} Complete</div>
      )}

      {/* Scanlines */}
      <div className="clear-scanlines" />
    </div>
  );
}

export default FloorClearOverlay;
