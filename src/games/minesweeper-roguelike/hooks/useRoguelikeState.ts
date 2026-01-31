import { useReducer, useEffect, useCallback } from 'react';
import {
  RoguelikeGameState,
  RoguelikeAction,
  PowerUp,
  PowerUpId,
  GamePhase,
  RunState,
  Cell,
  CellState,
} from '../types';
import {
  createEmptyBoard,
  placeMines,
  revealCell,
  toggleFlag,
  chordReveal,
  revealAllMines,
} from '../logic/gameLogic';
import {
  createRoguelikeInitialState,
  setupFloor,
  hasPowerUp,
  calculateDangerCells,
  applyLuckyStart,
  applySixthSense,
  applyXRayVision,
  calculateRevealScore,
  calculateFloorClearBonus,
  countRevealedCells,
  checkFloorCleared,
  isFinalFloor,
  countFlags,
} from '../logic/roguelikeLogic';
import { getFloorConfig, selectDraftOptions, getAvailablePowerUps } from '../constants';
import { saveGameState, loadGameState, clearGameState } from '../persistence';

// Helper: Handle floor clear transition and calculate draft options
function handleFloorClearTransition(
  run: RunState,
  time: number,
  unlocks: PowerUpId[]
): { phase: GamePhase; score: number; draftOptions: PowerUp[] } {
  const score = run.score + calculateFloorClearBonus(run.currentFloor, time);
  const draftOptions = isFinalFloor(run.currentFloor)
    ? []
    : selectDraftOptions(
        getAvailablePowerUps(unlocks),
        run.activePowerUps.map((p) => p.id),
        3
      );

  return { phase: GamePhase.FloorClear, score, draftOptions };
}

// Helper: Apply Iron Will protection when hitting a mine
function applyIronWillProtection(
  board: Cell[][],
  run: RunState,
  mineRow: number,
  mineCol: number,
  chordCenter?: { row: number; col: number }
): {
  board: Cell[][];
  run: RunState;
  saved: boolean;
  savedCell: { row: number; col: number } | null;
} {
  if (hasPowerUp(run, 'iron-will') && run.ironWillAvailable) {
    let newBoard: Cell[][];
    if (chordCenter) {
      // For chord hits, flag only revealed mines in the chord area (3x3 around chord center)
      const rows = board.length;
      const cols = board[0].length;
      newBoard = board.map((r) =>
        r.map((c) => {
          // Check if this cell is within the chord's 3x3 area
          const inChordArea =
            Math.abs(c.row - chordCenter.row) <= 1 &&
            Math.abs(c.col - chordCenter.col) <= 1 &&
            c.row >= 0 &&
            c.row < rows &&
            c.col >= 0 &&
            c.col < cols;
          return c.isMine && c.state === CellState.Revealed && inChordArea
            ? { ...c, state: CellState.Flagged }
            : c;
        })
      );
    } else {
      // For single cell hits, flag just the hit mine
      newBoard = board.map((r) =>
        r.map((c) =>
          c.row === mineRow && c.col === mineCol ? { ...c, state: CellState.Flagged } : c
        )
      );
    }
    return {
      board: newBoard,
      run: { ...run, ironWillAvailable: false },
      saved: true,
      savedCell: { row: mineRow, col: mineCol },
    };
  }
  return { board, run, saved: false, savedCell: null };
}

function roguelikeReducer(
  state: RoguelikeGameState,
  action: RoguelikeAction
): RoguelikeGameState {
  switch (action.type) {
    case 'START_RUN': {
      const newState = createRoguelikeInitialState(action.isMobile, action.unlocks);
      return setupFloor(newState, 1);
    }

    case 'GO_TO_START': {
      clearGameState();
      return {
        ...state,
        phase: GamePhase.Start,
      };
    }

    case 'SET_MOBILE': {
      if (state.isMobile === action.isMobile) return state;
      return {
        ...state,
        isMobile: action.isMobile,
      };
    }

    case 'TICK': {
      if (state.phase !== GamePhase.Playing) return state;
      return {
        ...state,
        time: Math.min(state.time + 1, 999),
      };
    }

    case 'REVEAL_CELL': {
      if (state.phase !== GamePhase.Playing) return state;

      const { row, col } = action;
      const cell = state.board[row][col];
      if (cell.state !== CellState.Hidden) return state;

      let newBoard = state.board;
      let newRun = { ...state.run };
      let newPhase: GamePhase = state.phase;
      let newDraftOptions: PowerUp[] = [];
      let newDangerCells = state.dangerCells;

      // Handle first click - place mines after
      if (state.isFirstClick) {
        const config = state.floorConfig;
        newBoard = placeMines(createEmptyBoard(config), config, row, col);

        // Apply Sixth Sense on first click
        if (hasPowerUp(state.run, 'sixth-sense')) {
          newBoard = applySixthSense(newBoard, row, col);
        } else {
          newBoard = revealCell(newBoard, row, col);
        }

        // Apply Lucky Start after mines are placed (if not used yet this floor)
        if (hasPowerUp(state.run, 'lucky-start') && !state.run.luckyStartUsedThisFloor) {
          newBoard = applyLuckyStart(newBoard);
          newRun.luckyStartUsedThisFloor = true;
        }

        // Calculate danger cells if player has Danger Sense
        if (hasPowerUp(state.run, 'danger-sense')) {
          newDangerCells = calculateDangerCells(newBoard);
        }

        // Calculate score for revealed cells
        const cellsRevealed = countRevealedCells(newBoard);
        newRun.score += calculateRevealScore(cellsRevealed, newRun.currentFloor);
      } else {
        // Normal reveal
        const prevRevealed = countRevealedCells(state.board);
        newBoard = revealCell(state.board, row, col);
        const newRevealed = countRevealedCells(newBoard);
        newRun.score += calculateRevealScore(newRevealed - prevRevealed, newRun.currentFloor);
      }

      // Check for mine hit
      let closeCallCell: { row: number; col: number } | null = null;
      if (newBoard[row][col].isMine) {
        const protection = applyIronWillProtection(newBoard, newRun, row, col);
        if (protection.saved) {
          newBoard = protection.board;
          newRun = protection.run;
          closeCallCell = protection.savedCell;
        } else {
          // Game over - start explosion animation
          return {
            ...state,
            board: newBoard,
            isFirstClick: false,
            phase: GamePhase.Exploding,
            run: newRun,
            explodedCell: { row, col },
            minesRemaining: state.floorConfig.mines - countFlags(newBoard),
          };
        }
      } else if (checkFloorCleared(newBoard)) {
        const clearResult = handleFloorClearTransition(newRun, state.time, state.unlocks);
        newRun.score = clearResult.score;
        newPhase = clearResult.phase;
        newDraftOptions = clearResult.draftOptions;
      }

      return {
        ...state,
        board: newBoard,
        isFirstClick: false,
        phase: newPhase,
        run: newRun,
        draftOptions: newDraftOptions,
        dangerCells: newDangerCells,
        minesRemaining: state.floorConfig.mines - countFlags(newBoard),
        closeCallCell,
      };
    }

    case 'TOGGLE_FLAG': {
      if (state.phase !== GamePhase.Playing) return state;
      if (state.isFirstClick) return state; // Can't flag before first click

      const { row, col } = action;
      const cell = state.board[row][col];
      if (cell.state === CellState.Revealed) return state;

      const newBoard = toggleFlag(state.board, row, col);

      return {
        ...state,
        board: newBoard,
        minesRemaining: state.floorConfig.mines - countFlags(newBoard),
      };
    }

    case 'CHORD_CLICK': {
      if (state.phase !== GamePhase.Playing) return state;

      const { row, col } = action;
      const { board: newBoard, hitMine } = chordReveal(state.board, row, col);

      let newPhase: GamePhase = state.phase;
      let newRun = { ...state.run };
      let finalBoard = newBoard;
      let newDraftOptions: PowerUp[] = [];

      // Calculate score for revealed cells
      const prevRevealed = countRevealedCells(state.board);
      const newRevealed = countRevealedCells(newBoard);
      newRun.score += calculateRevealScore(newRevealed - prevRevealed, newRun.currentFloor);

      let closeCallCell: { row: number; col: number } | null = null;
      if (hitMine) {
        // Find which mine was hit for the animation
        let hitRow = row,
          hitCol = col;
        for (let r = 0; r < newBoard.length; r++) {
          for (let c = 0; c < newBoard[0].length; c++) {
            if (newBoard[r][c].isMine && newBoard[r][c].state === CellState.Revealed) {
              hitRow = r;
              hitCol = c;
              break;
            }
          }
          if (hitRow !== row || hitCol !== col) break;
        }

        const protection = applyIronWillProtection(newBoard, newRun, hitRow, hitCol, { row, col });
        if (protection.saved) {
          finalBoard = protection.board;
          newRun = protection.run;
          closeCallCell = protection.savedCell;
        } else {
          return {
            ...state,
            board: newBoard,
            phase: GamePhase.Exploding,
            run: newRun,
            explodedCell: { row: hitRow, col: hitCol },
            minesRemaining: state.floorConfig.mines - countFlags(newBoard),
          };
        }
      } else if (checkFloorCleared(newBoard)) {
        const clearResult = handleFloorClearTransition(newRun, state.time, state.unlocks);
        newRun.score = clearResult.score;
        newPhase = clearResult.phase;
        newDraftOptions = clearResult.draftOptions;
      }

      return {
        ...state,
        board: finalBoard,
        phase: newPhase,
        run: newRun,
        draftOptions: newDraftOptions,
        minesRemaining: state.floorConfig.mines - countFlags(finalBoard),
        closeCallCell,
      };
    }

    case 'USE_X_RAY': {
      if (state.phase !== GamePhase.Playing) return state;
      if (!hasPowerUp(state.run, 'x-ray-vision')) return state;
      if (state.run.xRayUsedThisFloor) return state;
      if (state.isFirstClick) return state; // Can't use before mines are placed

      const { row, col } = action;
      const prevRevealed = countRevealedCells(state.board);
      const newBoard = applyXRayVision(state.board, row, col);
      const newRevealed = countRevealedCells(newBoard);

      let newRun = {
        ...state.run,
        xRayUsedThisFloor: true,
        score:
          state.run.score +
          calculateRevealScore(newRevealed - prevRevealed, state.run.currentFloor),
      };

      let newPhase: GamePhase = state.phase;
      let newDraftOptions: PowerUp[] = [];

      if (checkFloorCleared(newBoard)) {
        const clearResult = handleFloorClearTransition(newRun, state.time, state.unlocks);
        newRun.score = clearResult.score;
        newPhase = clearResult.phase;
        newDraftOptions = clearResult.draftOptions;
      }

      return {
        ...state,
        board: newBoard,
        run: newRun,
        phase: newPhase,
        draftOptions: newDraftOptions,
        minesRemaining: state.floorConfig.mines - countFlags(newBoard),
      };
    }

    case 'SELECT_POWER_UP': {
      if (state.phase !== GamePhase.Draft) return state;

      const newRun = {
        ...state.run,
        activePowerUps: [...state.run.activePowerUps, action.powerUp],
      };

      // Set up next floor
      const nextFloor = state.run.currentFloor + 1;
      const floorConfig = getFloorConfig(nextFloor, state.isMobile);
      const newBoard = createEmptyBoard(floorConfig);

      return {
        ...state,
        phase: GamePhase.Playing,
        board: newBoard,
        floorConfig,
        minesRemaining: floorConfig.mines,
        time: 0,
        isFirstClick: true,
        run: {
          ...newRun,
          currentFloor: nextFloor,
          xRayUsedThisFloor: false,
          luckyStartUsedThisFloor: false,
        },
        draftOptions: [],
        dangerCells: new Set(),
      };
    }

    case 'SKIP_DRAFT': {
      if (state.phase !== GamePhase.Draft) return state;

      // Set up next floor with bonus points
      const nextFloor = state.run.currentFloor + 1;
      const floorConfig = getFloorConfig(nextFloor, state.isMobile);
      const newBoard = createEmptyBoard(floorConfig);

      return {
        ...state,
        phase: GamePhase.Playing,
        board: newBoard,
        floorConfig,
        minesRemaining: floorConfig.mines,
        time: 0,
        isFirstClick: true,
        run: {
          ...state.run,
          currentFloor: nextFloor,
          score: state.run.score + action.bonusPoints,
          xRayUsedThisFloor: false,
          luckyStartUsedThisFloor: false,
        },
        draftOptions: [],
        dangerCells: new Set(),
      };
    }

    case 'EXPLOSION_COMPLETE': {
      if (state.phase !== GamePhase.Exploding) return state;

      // Reveal all mines and transition to run-over
      const finalBoard = revealAllMines(state.board);

      return {
        ...state,
        board: finalBoard,
        phase: GamePhase.RunOver,
        explodedCell: null,
      };
    }

    case 'FLOOR_CLEAR_COMPLETE': {
      if (state.phase !== GamePhase.FloorClear) return state;

      // Check if this was the final floor
      if (isFinalFloor(state.run.currentFloor)) {
        return {
          ...state,
          phase: GamePhase.Victory,
        };
      }

      // Move to draft phase
      return {
        ...state,
        phase: GamePhase.Draft,
      };
    }

    case 'CLOSE_CALL_COMPLETE': {
      return {
        ...state,
        closeCallCell: null,
      };
    }

    default:
      return state;
  }
}

export function useRoguelikeState(isMobile: boolean = false, unlocks: PowerUpId[] = []) {
  const [state, dispatch] = useReducer(
    roguelikeReducer,
    { isMobile, unlocks },
    (init) => loadGameState(init.unlocks) ?? createRoguelikeInitialState(init.isMobile, init.unlocks)
  );

  // Handle mobile state changes
  useEffect(() => {
    if (state.isMobile !== isMobile) {
      dispatch({ type: 'SET_MOBILE', isMobile });
    }
  }, [isMobile, state.isMobile]);

  // Save state to localStorage during active gameplay
  useEffect(() => {
    if (
      state.phase === GamePhase.Playing ||
      state.phase === GamePhase.Draft ||
      state.phase === GamePhase.FloorClear
    ) {
      saveGameState(state);
    } else if (
      state.phase === GamePhase.Start ||
      state.phase === GamePhase.RunOver ||
      state.phase === GamePhase.Victory
    ) {
      // Clear saved state when not in active gameplay
      clearGameState();
    }
  }, [state]);

  // Timer effect
  useEffect(() => {
    if (state.phase !== GamePhase.Playing) return;

    const interval = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.phase]);

  // Close call effect - auto-clear after animation
  useEffect(() => {
    if (!state.closeCallCell) return;

    const timeout = setTimeout(() => {
      dispatch({ type: 'CLOSE_CALL_COMPLETE' });
    }, 1200);

    return () => clearTimeout(timeout);
  }, [state.closeCallCell]);

  const startRun = useCallback(
    (runUnlocks: PowerUpId[] = []) => {
      dispatch({ type: 'START_RUN', isMobile, unlocks: runUnlocks });
    },
    [isMobile]
  );

  const goToStart = useCallback(() => {
    dispatch({ type: 'GO_TO_START' });
  }, []);

  const revealCellAction = useCallback((row: number, col: number) => {
    dispatch({ type: 'REVEAL_CELL', row, col });
  }, []);

  const toggleFlagAction = useCallback((row: number, col: number) => {
    dispatch({ type: 'TOGGLE_FLAG', row, col });
  }, []);

  const chordClick = useCallback((row: number, col: number) => {
    dispatch({ type: 'CHORD_CLICK', row, col });
  }, []);

  const useXRay = useCallback((row: number, col: number) => {
    dispatch({ type: 'USE_X_RAY', row, col });
  }, []);

  const selectPowerUp = useCallback((powerUp: PowerUp) => {
    dispatch({ type: 'SELECT_POWER_UP', powerUp });
  }, []);

  const skipDraft = useCallback((bonusPoints: number) => {
    dispatch({ type: 'SKIP_DRAFT', bonusPoints });
  }, []);

  const explosionComplete = useCallback(() => {
    dispatch({ type: 'EXPLOSION_COMPLETE' });
  }, []);

  const floorClearComplete = useCallback(() => {
    dispatch({ type: 'FLOOR_CLEAR_COMPLETE' });
  }, []);

  return {
    state,
    startRun,
    goToStart,
    revealCell: revealCellAction,
    toggleFlag: toggleFlagAction,
    chordClick,
    useXRay,
    selectPowerUp,
    skipDraft,
    explosionComplete,
    floorClearComplete,
  };
}
