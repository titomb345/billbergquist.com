import { PowerUp, RoguelikeStats } from '../types';
import { MAX_FLOOR, UNLOCK_FLOOR_5_REWARD } from '../constants';

interface RunOverScreenProps {
  isVictory: boolean;
  floor: number;
  score: number;
  time: number;
  powerUps: PowerUp[];
  stats: RoguelikeStats;
  onTryAgain: () => void;
}

function RunOverScreen({
  isVictory,
  floor,
  score,
  time,
  powerUps,
  stats,
  onTryAgain,
}: RunOverScreenProps) {
  const isNewBestFloor = floor > stats.bestFloor;
  const isNewBestScore = score > stats.bestScore;
  const justUnlocked = floor >= 5 && !stats.unlocks.includes(UNLOCK_FLOOR_5_REWARD);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className={`run-over-screen ${isVictory ? 'victory' : 'defeat'}`}>
      {isVictory ? (
        <>
          <h2 className="run-over-title victory-title">ESCAPED!</h2>
          <p className="run-over-subtitle">You conquered all {MAX_FLOOR} floors!</p>
        </>
      ) : (
        <>
          <h2 className="run-over-title defeat-title">RUN OVER</h2>
          <p className="run-over-subtitle">Defeated on floor {floor}</p>
        </>
      )}

      <div className="run-summary">
        <div className="summary-row">
          <span className="summary-label">Floor Reached</span>
          <span className="summary-value">
            {floor}/{MAX_FLOOR}
            {isNewBestFloor && <span className="new-best">NEW BEST!</span>}
          </span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Final Score</span>
          <span className="summary-value">
            {score.toLocaleString()}
            {isNewBestScore && <span className="new-best">NEW BEST!</span>}
          </span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Time</span>
          <span className="summary-value">{formatTime(time)}</span>
        </div>
        {powerUps.length > 0 && (
          <div className="summary-row">
            <span className="summary-label">Power-Ups</span>
            <span className="summary-value powerups-list">
              {powerUps.map((p) => (
                <span key={p.id} className="powerup-badge" title={p.name}>
                  {p.icon}
                </span>
              ))}
            </span>
          </div>
        )}
      </div>

      {justUnlocked && (
        <div className="unlock-notification">
          <span className="unlock-icon">🎉</span>
          <span className="unlock-text">
            Unlocked: <strong>📡 Mine Detector</strong>
          </span>
          <span className="unlock-description">Shows exact mine count in a 5×5 area</span>
        </div>
      )}

      <button className="try-again-button" onClick={onTryAgain}>
        {isVictory ? 'PLAY AGAIN' : 'TRY AGAIN'}
      </button>

      <div className="lifetime-stats">
        <span className="lifetime-label">Lifetime Stats</span>
        <span className="lifetime-value">
          {stats.totalRuns + 1} runs • {stats.floorsCleared + floor - 1} floors
        </span>
      </div>
    </div>
  );
}

export default RunOverScreen;
