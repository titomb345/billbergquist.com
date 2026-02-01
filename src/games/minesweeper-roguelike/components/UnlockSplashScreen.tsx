import { useEffect, useCallback } from 'react';
import { PowerUp } from '../types';

interface UnlockSplashScreenProps {
  powerUp: PowerUp;
  onContinue: () => void;
}

function UnlockSplashScreen({ powerUp, onContinue }: UnlockSplashScreenProps) {
  // Auto-dismiss after 10 seconds
  useEffect(() => {
    const timer = setTimeout(onContinue, 10000);
    return () => clearTimeout(timer);
  }, [onContinue]);

  // Dismiss on keypress
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        onContinue();
      }
    },
    [onContinue]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="unlock-splash-screen" onClick={onContinue}>
      <div className="unlock-splash-content">
        <div className="unlock-splash-celebration">
          <span className="unlock-star">✦</span>
          <span className="unlock-star">✦</span>
          <span className="unlock-star">✦</span>
        </div>
        <h2 className="unlock-splash-title">NEW UNLOCK!</h2>
        <div className={`unlock-relic-card rarity-${powerUp.rarity}`}>
          <div className="unlock-relic-icon-box">
            <span className="unlock-relic-icon">{powerUp.icon}</span>
          </div>
          <div className="unlock-relic-info">
            <div className="unlock-relic-header">
              <span className="unlock-relic-name">{powerUp.name}</span>
              <span className={`rarity-badge rarity-${powerUp.rarity}`}>
                {powerUp.rarity}
              </span>
            </div>
            <p className="unlock-relic-description">{powerUp.description}</p>
          </div>
        </div>
        <div className="unlock-splash-hint">Click anywhere or press any key to continue</div>
      </div>
    </div>
  );
}

export default UnlockSplashScreen;
