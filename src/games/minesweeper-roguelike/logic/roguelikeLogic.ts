import { Cell, CellState, GamePhase, PowerUpId, RoguelikeGameState, RunState } from '../types';
import { getFloorConfig, SCORING, MAX_FLOOR } from '../constants';
import { createEmptyBoard, revealCell, revealCascade } from './gameLogic';

// Generate a short run seed for sharing/comparing runs
function generateRunSeed(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars like 0/O, 1/I
  let seed = '';
  for (let i = 0; i < 6; i++) {
    seed += chars[Math.floor(Math.random() * chars.length)];
  }
  return seed;
}

// Create initial run state
export function createInitialRunState(): RunState {
  return {
    currentFloor: 1,
    score: 0,
    activePowerUps: [],
    ironWillAvailable: true,
    xRayUsedThisFloor: false,
    luckyStartUsedThisFloor: false,
    seed: generateRunSeed(),
  };
}

// Create initial roguelike game state for a new run
export function createRoguelikeInitialState(isMobile: boolean, unlocks: PowerUpId[] = []): RoguelikeGameState {
  const floorConfig = getFloorConfig(1, isMobile);
  return {
    phase: GamePhase.Start,
    board: createEmptyBoard(floorConfig),
    floorConfig,
    minesRemaining: floorConfig.mines,
    time: 0,
    isFirstClick: true,
    isMobile,
    run: createInitialRunState(),
    draftOptions: [],
    dangerCells: new Set(),
    explodedCell: null,
    closeCallCell: null,
    unlocks,
  };
}

// Set up a new floor (called when starting run or advancing to next floor)
export function setupFloor(state: RoguelikeGameState, floor: number): RoguelikeGameState {
  const floorConfig = getFloorConfig(floor, state.isMobile);
  const board = createEmptyBoard(floorConfig);

  return {
    ...state,
    phase: GamePhase.Playing,
    board,
    floorConfig,
    minesRemaining: floorConfig.mines,
    time: 0,
    isFirstClick: true,
    dangerCells: new Set(),
    explodedCell: null,
    closeCallCell: null,
    run: {
      ...state.run,
      currentFloor: floor,
      xRayUsedThisFloor: false,
      luckyStartUsedThisFloor: false,
    },
  };
}

// Check if player has a specific power-up
export function hasPowerUp(run: RunState, powerUpId: PowerUpId): boolean {
  return run.activePowerUps.some((p) => p.id === powerUpId);
}

// Calculate danger cells (cells adjacent to 3+ mines) for Danger Sense
export function calculateDangerCells(board: Cell[][]): Set<string> {
  const dangerCells = new Set<string>();
  const rows = board.length;
  const cols = board[0]?.length || 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = board[row][col];
      if (cell.state === CellState.Hidden && !cell.isMine && cell.adjacentMines >= 3) {
        dangerCells.add(`${row},${col}`);
      }
    }
  }

  return dangerCells;
}

// Apply Lucky Start: reveal 3 random safe cells scattered across the board
export function applyLuckyStart(board: Cell[][]): Cell[][] {
  let newBoard = board;
  const rows = board.length;
  const cols = board[0].length;

  // Pre-compute revealed positions once (optimization: O(n) instead of O(n) per safe cell)
  const getRevealedPositions = (b: Cell[][]): Array<{ row: number; col: number }> => {
    const positions: Array<{ row: number; col: number }> = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (b[r][c].state === CellState.Revealed) {
          positions.push({ row: r, col: c });
        }
      }
    }
    return positions;
  };

  // Find all hidden safe cells
  const getHiddenSafeCells = (b: Cell[][]): Array<{ row: number; col: number }> => {
    const cells: Array<{ row: number; col: number }> = [];
    for (const row of b) {
      for (const cell of row) {
        if (!cell.isMine && cell.state === CellState.Hidden) {
          cells.push({ row: cell.row, col: cell.col });
        }
      }
    }
    return cells;
  };

  // Reveal up to 3 cells, preferring cells far from already-revealed areas
  for (let i = 0; i < 3; i++) {
    const safeCells = getHiddenSafeCells(newBoard);
    if (safeCells.length === 0) break;

    // Cache revealed positions for this iteration
    const revealedPositions = getRevealedPositions(newBoard);

    // Score cells by distance from revealed cells (prefer isolated cells)
    // Now O(safeCells * revealedPositions) instead of O(safeCells * rows * cols)
    const scoredCells = safeCells.map((pos) => {
      let minDistToRevealed = Infinity;
      for (const revealed of revealedPositions) {
        const dist = Math.abs(pos.row - revealed.row) + Math.abs(pos.col - revealed.col);
        minDistToRevealed = Math.min(minDistToRevealed, dist);
      }
      return { ...pos, score: minDistToRevealed };
    });

    // Sort by score (highest first = furthest from revealed)
    scoredCells.sort((a, b) => b.score - a.score);

    // Pick from top candidates with some randomness
    const topCandidates = scoredCells.slice(0, Math.max(3, Math.floor(scoredCells.length / 3)));
    const chosen = topCandidates[Math.floor(Math.random() * topCandidates.length)];

    newBoard = revealCell(newBoard, chosen.row, chosen.col);
  }

  return newBoard;
}

// Apply Sixth Sense: find nearest 0-cell and reveal from there for maximum cascade
export function applySixthSense(board: Cell[][], clickRow: number, clickCol: number): Cell[][] {
  const rows = board.length;
  const cols = board[0].length;

  // Find the nearest 0-cell to maximize cascade
  let bestCell: { row: number; col: number } | null = null;
  let bestDist = Infinity;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = board[r][c];
      if (!cell.isMine && cell.adjacentMines === 0 && cell.state === CellState.Hidden) {
        const dist = Math.abs(r - clickRow) + Math.abs(c - clickCol);
        if (dist < bestDist) {
          bestDist = dist;
          bestCell = { row: r, col: c };
        }
      }
    }
  }

  // If we found a 0-cell, reveal from there first, then reveal the clicked cell
  if (bestCell && (bestCell.row !== clickRow || bestCell.col !== clickCol)) {
    let newBoard = revealCell(board, bestCell.row, bestCell.col);
    // Also reveal the originally clicked cell if it's still hidden
    if (newBoard[clickRow][clickCol].state === CellState.Hidden) {
      newBoard = revealCell(newBoard, clickRow, clickCol);
    }
    return newBoard;
  }

  // Fallback: just reveal the clicked cell normally
  return revealCell(board, clickRow, clickCol);
}

// Apply X-Ray Vision: safely reveal 3x3 area
export function applyXRayVision(board: Cell[][], centerRow: number, centerCol: number): Cell[][] {
  let newBoard = board.map((r) => r.map((c) => ({ ...c })));
  const rows = newBoard.length;
  const cols = newBoard[0].length;

  // Collect cells that need cascading (0-cells)
  const cellsToCascade: Array<{ row: number; col: number }> = [];

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const r = centerRow + dr;
      const c = centerCol + dc;
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        const cell = newBoard[r][c];
        if (cell.state === CellState.Hidden) {
          if (cell.isMine) {
            // Mark mines as flagged instead of revealing
            cell.state = CellState.Flagged;
          } else {
            cell.state = CellState.Revealed;
            // Queue 0-cells for cascading after we process all cells
            if (cell.adjacentMines === 0) {
              cellsToCascade.push({ row: r, col: c });
            }
          }
        }
      }
    }
  }

  // Now cascade from all 0-cells found in the 3x3 area
  for (const { row, col } of cellsToCascade) {
    newBoard = revealCascade(newBoard, row, col);
  }

  return newBoard;
}

// Calculate score for revealing cells
export function calculateRevealScore(cellsRevealed: number, floor: number): number {
  const floorMultiplier = Math.pow(SCORING.FLOOR_MULTIPLIER, floor - 1);
  return Math.floor(cellsRevealed * SCORING.BASE_CELL_REVEAL * floorMultiplier);
}

// Calculate floor clear bonus
export function calculateFloorClearBonus(floor: number, time: number): number {
  let bonus = SCORING.FLOOR_CLEAR_BONUS * floor;

  // Time bonus for fast clears
  if (time < SCORING.TIME_BONUS_THRESHOLD) {
    bonus = Math.floor(bonus * SCORING.TIME_BONUS_MULTIPLIER);
  }

  return bonus;
}

// Count revealed cells (for scoring)
export function countRevealedCells(board: Cell[][]): number {
  let count = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell.state === CellState.Revealed && !cell.isMine) {
        count++;
      }
    }
  }
  return count;
}

// Check if all non-mine cells are revealed (floor cleared)
export function checkFloorCleared(board: Cell[][]): boolean {
  for (const row of board) {
    for (const cell of row) {
      if (!cell.isMine && cell.state !== CellState.Revealed) {
        return false;
      }
    }
  }
  return true;
}

// Check if this is the final floor
export function isFinalFloor(floor: number): boolean {
  return floor >= MAX_FLOOR;
}

// Calculate mine count in 5×5 area for Mine Detector power-up
export function calculateMineCount5x5(
  board: Cell[][],
  centerRow: number,
  centerCol: number
): number {
  const rows = board.length;
  const cols = board[0]?.length || 0;
  let count = 0;

  for (let dr = -2; dr <= 2; dr++) {
    for (let dc = -2; dc <= 2; dc++) {
      const r = centerRow + dr;
      const c = centerCol + dc;
      if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c].isMine) {
        count++;
      }
    }
  }

  return count;
}

// Re-export countFlags from gameLogic to avoid duplication
export { countFlags } from './gameLogic';
