import { useEffect } from 'react';

interface ExplosionOverlayProps {
  onComplete: () => void;
}

function ExplosionOverlay({ onComplete }: ExplosionOverlayProps) {
  useEffect(() => {
    // Trigger completion after animation finishes
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="explosion-overlay">
      <div className="explosion-container">
        {/* Multiple expanding rings */}
        <div className="explosion-ring ring-1" />
        <div className="explosion-ring ring-2" />
        <div className="explosion-ring ring-3" />

        {/* Central flash */}
        <div className="explosion-flash" />

        {/* Pixel debris particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="explosion-particle"
            style={{
              '--angle': `${i * 30}deg`,
              '--delay': `${i * 0.03}s`,
              '--distance': `${80 + Math.random() * 60}px`,
            } as React.CSSProperties}
          />
        ))}

        {/* Screen shake handled by parent container */}
      </div>

      {/* Scanlines for retro effect */}
      <div className="explosion-scanlines" />

      {/* Death text */}
      <div className="explosion-text">BOOM</div>
    </div>
  );
}

export default ExplosionOverlay;
