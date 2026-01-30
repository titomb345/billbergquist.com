import { useRef } from 'react';
import { useGameState } from './hooks/useGameState';
import { useContainerWidth } from './hooks/useContainerWidth';
import Board from './components/Board';
import Header from './components/Header';
import DifficultySelector from './components/DifficultySelector';
import { Difficulty } from './types';
import './styles.css';

function Minesweeper() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isConstrained = useContainerWidth(containerRef);
  const { state, revealCell, toggleFlag, chordClick, newGame } =
    useGameState('beginner', isConstrained);

  const handleDifficultyChange = (difficulty: Difficulty) => {
    newGame(difficulty);
  };

  const handleNewGame = () => {
    newGame();
  };

  const isGameOver = state.status === 'won' || state.status === 'lost';

  return (
    <div ref={containerRef} className="minesweeper-container">
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
        <p className="game-message game-message-win">YOU WIN!</p>
      )}
      {state.status === 'lost' && (
        <p className="game-message game-message-lose">GAME OVER</p>
      )}
    </div>
  );
}

export default Minesweeper;
