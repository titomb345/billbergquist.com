import { RoguelikeStats } from '../types';
import { MAX_FLOOR } from '../constants';

interface StartScreenProps {
  stats: RoguelikeStats;
  onStartRun: () => void;
}

function StartScreen({ stats, onStartRun }: StartScreenProps) {
  const hasPlayed = stats.totalRuns > 0;

  return (
    <div className="start-screen">
      <p className="start-subtitle">A Minesweeper Roguelike</p>

      <div className="start-description">
        <p>Clear {MAX_FLOOR} floors to escape.</p>
        <p>Each floor grows larger with more mines.</p>
        <p>One wrong step ends your run.</p>
        <p>Collect power-ups to survive.</p>
      </div>

      <button className="start-button" onClick={onStartRun}>
        {hasPlayed ? 'START NEW RUN' : 'BEGIN DESCENT'}
      </button>

      {hasPlayed && (
        <div className="start-stats">
          <h3 className="stats-title">YOUR PROGRESS</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{stats.totalRuns}</span>
              <span className="stat-label">Runs</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {stats.bestFloor}/{MAX_FLOOR}
              </span>
              <span className="stat-label">Best Floor</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.bestScore.toLocaleString()}</span>
              <span className="stat-label">Best Score</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.floorsCleared}</span>
              <span className="stat-label">Floors Cleared</span>
            </div>
          </div>
          {stats.unlocks.length > 0 && (
            <div className="unlocks-display">
              <span className="unlocks-label">Unlocks:</span>
              {stats.unlocks.map((unlock) => (
                <span key={unlock} className="unlock-badge">
                  {unlock === 'mine-detector' ? '📡 Mine Detector' : unlock}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StartScreen;
