import { useRef, useState, useCallback } from 'react';
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
import CloseCallOverlay from './components/CloseCallOverlay';
import { isFinalFloor, calculateMineCount5x5 } from './logic/roguelikeLogic';
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
  } = useRoguelikeState(isConstrained, stats.unlocks);

  const [xRayMode, setXRayMode] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  const handleStartRun = () => {
    startRun(stats.unlocks);
  };

  // Mine Detector: calculate 5×5 mine count when hovering
  const hasMineDetector = state.run.activePowerUps.some((p) => p.id === 'mine-detector');
  const mineDetectorCount =
    hasMineDetector && hoveredCell && !state.isFirstClick
      ? calculateMineCount5x5(state.board, hoveredCell.row, hoveredCell.col)
      : null;

  const handleCellHover = useCallback((row: number, col: number) => {
    setHoveredCell({ row, col });
  }, []);

  const handleCellHoverEnd = useCallback(() => {
    setHoveredCell(null);
  }, []);

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
    startRun(stats.unlocks);
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
            mineDetectorCount={mineDetectorCount}
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
              onCellHover={hasMineDetector ? handleCellHover : undefined}
              onCellHoverEnd={hasMineDetector ? handleCellHoverEnd : undefined}
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

      {/* Close Call Animation (Iron Will saved) */}
      {state.closeCallCell && <CloseCallOverlay />}

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
          seed={state.run.seed}
          onTryAgain={handleRunEnd}
        />
      )}
    </div>
  );
}

export default Minesweeper;
