import { useState, useRef } from 'react';
import { RunState, PowerUp } from '../types';
import { MAX_FLOOR } from '../constants';
import { HomeIcon } from './icons';

interface RoguelikeHeaderProps {
  floor: number;
  score: number;
  time: number;
  minesRemaining: number;
  run: RunState;
  onNewRun: () => void;
  xRayMode?: boolean;
  canUseXRay?: boolean;
  onToggleXRay?: () => void;
}

interface HoveredPowerUp {
  powerUp: PowerUp;
  isUsed: boolean;
  arrowOffset: number;
}

function RoguelikeHeader({
  floor,
  score,
  time,
  minesRemaining,
  run,
  onNewRun,
  xRayMode = false,
  canUseXRay = false,
  onToggleXRay,
}: RoguelikeHeaderProps) {
  const [hoveredPowerUp, setHoveredPowerUp] = useState<HoveredPowerUp | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const formatNumber = (num: number): string => {
    const clamped = Math.max(-99, Math.min(999, num));
    if (clamped < 0) {
      return '-' + String(Math.abs(clamped)).padStart(2, '0');
    }
    return String(clamped).padStart(3, '0');
  };

  const formatScore = (num: number): string => {
    if (num >= 10000) {
      return Math.floor(num / 1000) + 'K';
    }
    return String(num);
  };

  const handleMouseEnter = (powerUp: PowerUp, isUsed: boolean, iconElement: HTMLSpanElement) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const iconRect = iconElement.getBoundingClientRect();
    const iconCenter = iconRect.left + iconRect.width / 2;
    const containerCenter = containerRect.left + containerRect.width / 2;
    const arrowOffset = iconCenter - containerCenter;

    setHoveredPowerUp({ powerUp, isUsed, arrowOffset });
  };

  return (
    <div className="roguelike-header">
      <div className="roguelike-header-top">
        <div className="floor-indicator">
          <span className="floor-label">FLOOR</span>
          <span className="floor-number">
            {floor}/{MAX_FLOOR}
          </span>
        </div>
        <button className="restart-button" onClick={onNewRun} title="Return to Menu">
          <HomeIcon className="home-icon" />
        </button>
        <div className="score-display">
          <span className="score-label">SCORE</span>
          <span className="score-number">{formatScore(score)}</span>
        </div>
      </div>
      <div className="roguelike-header-bottom">
        <div className="led-display">{formatNumber(minesRemaining)}</div>
        <div className="active-powerups" ref={containerRef}>
          {/* Shared tooltip */}
          {hoveredPowerUp && (
            <div className="powerup-tooltip">
              <span className="powerup-tooltip-name">{hoveredPowerUp.powerUp.name}</span>
              <span className="powerup-tooltip-type">{hoveredPowerUp.powerUp.type}</span>
              <span className="powerup-tooltip-desc">{hoveredPowerUp.powerUp.description}</span>
              {hoveredPowerUp.isUsed && <span className="powerup-tooltip-status">USED</span>}
              <span
                className="powerup-tooltip-arrow"
                style={{ left: `calc(50% + ${hoveredPowerUp.arrowOffset}px)` }}
              />
            </div>
          )}
          {/* Icons */}
          {run.activePowerUps.map((powerUp) => {
            const isIronWillUsed = !run.ironWillAvailable && powerUp.id === 'iron-will';
            const isXRay = powerUp.id === 'x-ray-vision';
            const isXRayUsed = isXRay && run.xRayUsedThisFloor;
            const isUsed = isIronWillUsed || isXRayUsed;
            const isClickable = isXRay && canUseXRay && onToggleXRay;

            return (
              <span
                key={powerUp.id}
                className={`powerup-icon-wrapper ${isUsed ? 'used' : ''} ${isXRay ? 'xray' : ''} ${xRayMode ? 'xray-active' : ''} ${isClickable ? 'clickable' : ''}`}
                onMouseEnter={(e) => handleMouseEnter(powerUp, isUsed, e.currentTarget)}
                onMouseLeave={() => setHoveredPowerUp(null)}
                onClick={isClickable ? onToggleXRay : undefined}
              >
                <span className="powerup-icon-emoji">{powerUp.icon}</span>
              </span>
            );
          })}
        </div>
        <div className="led-display">{formatNumber(time)}</div>
      </div>
    </div>
  );
}

export default RoguelikeHeader;
