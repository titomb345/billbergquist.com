import { useGameState } from './hooks/useGameState';
import { useIsMobile } from './hooks/useIsMobile';
import Board from './components/Board';
import Header from './components/Header';
import DifficultySelector from './components/DifficultySelector';
import { Difficulty } from './types';
import './styles.css';

function Minesweeper() {
  const isMobile = useIsMobile();
  const { state, revealCell, toggleFlag, chordClick, newGame } =
    useGameState('beginner', isMobile);

  const handleDifficultyChange = (difficulty: Difficulty) => {
    newGame(difficulty);
  };

  const handleNewGame = () => {
    newGame();
  };

  const isGameOver = state.status === 'won' || state.status === 'lost';

  return (
    <div className="minesweeper-container">
      <h1>Minesweeper</h1>
      <DifficultySelector
        currentDifficulty={state.difficulty}
        onSelect={handleDifficultyChange}
      />
      <div className="minesweeper">
        <Header
          minesRemaining={state.minesRemaining}
          time={state.time}
          status={state.status}
          onNewGame={handleNewGame}
        />
        <Board
          board={state.board}
          onReveal={revealCell}
          onFlag={toggleFlag}
          onChord={chordClick}
          gameOver={isGameOver}
        />
      </div>
      {state.status === 'won' && (
        <p style={{ marginTop: '10px', color: 'green', fontWeight: 'bold' }}>
          You Win!
        </p>
      )}
      {state.status === 'lost' && (
        <p style={{ marginTop: '10px', color: 'red', fontWeight: 'bold' }}>
          Game Over!
        </p>
      )}
    </div>
  );
}

export default Minesweeper;
