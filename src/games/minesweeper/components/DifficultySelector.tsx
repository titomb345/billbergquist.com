import { Difficulty } from '../types';

interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
}

function DifficultySelector({
  currentDifficulty,
  onSelect,
}: DifficultySelectorProps) {
  const difficulties: { key: Difficulty; label: string }[] = [
    { key: 'beginner', label: 'Beginner' },
    { key: 'intermediate', label: 'Intermediate' },
    { key: 'expert', label: 'Expert' },
  ];

  return (
    <div className="difficulty-selector">
      {difficulties.map(({ key, label }) => (
        <button
          key={key}
          className={`difficulty-button ${currentDifficulty === key ? 'active' : ''}`}
          onClick={() => onSelect(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default DifficultySelector;
