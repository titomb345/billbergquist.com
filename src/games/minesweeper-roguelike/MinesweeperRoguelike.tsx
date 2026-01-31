import { useRef, useState } from 'react';
import { useRoguelikeState } from './hooks/useRoguelikeState';
import { useContainerWidth } from './hooks/useContainerWidth';
import { useRoguelikeStats } from './hooks/useRoguelikeStats';
import Board from './components/Board';
import RoguelikeHeader from './components/RoguelikeHeader';
import StartScreen from './components/StartScreen';
import PowerUpDraft from './components/PowerUpDraft';
import RunOverScreen from './components/RunOverScreen';
import ExplosionOverlay from './components/ExplosionOverlay';
import FloorClearOverlay from './components/FloorClearOverlay';
import { isFinalFloor } from './logic/roguelikeLogic';
import { GamePhase } from './types';
import './styles.css';

function Minesweeper() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isConstrained = useContainerWidth(containerRef);
  const { stats, recordRun } = useRoguelikeStats();
  const {
    state,
    startRun,
    goToStart,
    revealCell,
    toggleFlag,
    chordClick,
    useXRay,
    selectPowerUp,
    skipDraft,
    explosionComplete,
    floorClearComplete,
  } = useRoguelikeState(isConstrained);

  const [xRayMode, setXRayMode] = useState(false);

  const handleStartRun = () => {
    startRun();
  };

  const handleXRayClick = (row: number, col: number) => {
    useXRay(row, col);
    setXRayMode(false);
  };

  const handleToggleXRayMode = () => {
    setXRayMode(!xRayMode);
  };

  // Check if X-Ray is available
  const hasXRay = state.run.activePowerUps.some((p) => p.id === 'x-ray-vision');
  const canUseXRay = hasXRay && !state.run.xRayUsedThisFloor && !state.isFirstClick;

  // Record run on game over/victory
  const handleRunEnd = () => {
    recordRun(state.run.currentFloor, state.run.score);
    startRun();
  };

  const isGameOver = state.phase === GamePhase.RunOver || state.phase === GamePhase.Victory;

  return (
    <div ref={containerRef} className="minesweeper-container roguelike-mode">
      {/* Start Screen */}
      {state.phase === GamePhase.Start && <StartScreen stats={stats} onStartRun={handleStartRun} />}

      {/* Main Game */}
      {state.phase === GamePhase.Playing && (
        <>
          <RoguelikeHeader
            floor={state.run.currentFloor}
            score={state.run.score}
            time={state.time}
            minesRemaining={state.minesRemaining}
            run={state.run}
            onNewRun={goToStart}
            xRayMode={xRayMode}
            canUseXRay={canUseXRay}
            onToggleXRay={handleToggleXRayMode}
          />
          {xRayMode && <div className="xray-hint">Click a cell to reveal 3×3 area</div>}
          <div className="minesweeper">
            <Board
              board={state.board}
              onReveal={revealCell}
              onFlag={toggleFlag}
              onChord={chordClick}
              gameOver={false}
              dangerCells={state.dangerCells}
              xRayMode={xRayMode && canUseXRay}
              onXRay={handleXRayClick}
            />
          </div>
        </>
      )}

      {/* Power-Up Draft */}
      {state.phase === GamePhase.Draft && (
        <PowerUpDraft
          options={state.draftOptions}
          floorCleared={state.run.currentFloor}
          score={state.run.score}
          onSelect={selectPowerUp}
          onContinue={() => skipDraft(500)}
        />
      )}

      {/* Explosion Animation */}
      {state.phase === GamePhase.Exploding && <ExplosionOverlay onComplete={explosionComplete} />}

      {/* Floor Clear Animation */}
      {state.phase === GamePhase.FloorClear && (
        <FloorClearOverlay
          floor={state.run.currentFloor}
          isVictory={isFinalFloor(state.run.currentFloor)}
          onComplete={floorClearComplete}
        />
      )}

      {/* Run Over / Victory */}
      {isGameOver && (
        <RunOverScreen
          isVictory={state.phase === GamePhase.Victory}
          floor={state.run.currentFloor}
          score={state.run.score}
          time={state.time}
          powerUps={state.run.activePowerUps}
          stats={stats}
          onTryAgain={handleRunEnd}
        />
      )}
    </div>
  );
}

export default Minesweeper;
