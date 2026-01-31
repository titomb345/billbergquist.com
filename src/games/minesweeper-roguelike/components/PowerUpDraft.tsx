import { PowerUp } from '../types';

interface PowerUpDraftProps {
  options: PowerUp[];
  floorCleared: number;
  score: number;
  onSelect: (powerUp: PowerUp) => void;
  onContinue: () => void;
}

const BONUS_POINTS = 500;

function PowerUpDraft({ options, floorCleared, score, onSelect, onContinue }: PowerUpDraftProps) {
  const hasOptions = options.length > 0;

  return (
    <div className="draft-screen">
      <div className="draft-header">
        <h2 className="draft-title">FLOOR {floorCleared} CLEARED!</h2>
        <p className="draft-score">Score: {score.toLocaleString()}</p>
      </div>

      {hasOptions ? (
        <>
          <p className="draft-instruction">Choose your reward:</p>
          <div className="draft-cards">
            {options.map((powerUp) => (
              <button key={powerUp.id} className="draft-card" onClick={() => onSelect(powerUp)}>
                <div className="draft-card-left">
                  <span className="draft-card-icon">{powerUp.icon}</span>
                </div>
                <div className="draft-card-right">
                  <div className="draft-card-header">
                    <span className="draft-card-name">{powerUp.name}</span>
                    <span className={`draft-card-type ${powerUp.type}`}>{powerUp.type}</span>
                  </div>
                  <span className="draft-card-description">{powerUp.description}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="draft-maxed">
          <p className="draft-maxed-title">FULLY POWERED!</p>
          <p className="draft-maxed-subtitle">All power-ups collected</p>
          <div className="draft-bonus">
            <span className="draft-bonus-icon">⭐</span>
            <span className="draft-bonus-text">+{BONUS_POINTS} BONUS</span>
          </div>
          <button className="draft-continue-button" onClick={onContinue}>
            CONTINUE
          </button>
        </div>
      )}

      <p className="draft-hint">Floor {floorCleared + 1} awaits...</p>
    </div>
  );
}

export default PowerUpDraft;
