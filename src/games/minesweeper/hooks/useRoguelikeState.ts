import { useReducer, useEffect, useCallback } from 'react';
import { RoguelikeGameState, RoguelikeAction, PowerUp, GamePhase } from '../types';
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

function roguelikeReducer(state: RoguelikeGameState, action: RoguelikeAction): RoguelikeGameState {
  switch (action.type) {
    case 'START_RUN': {
      const newState = createRoguelikeInitialState(action.isMobile);
      return setupFloor(newState, 1);
    }

    case 'GO_TO_START': {
      return {
        ...state,
        phase: 'start',
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
      if (state.phase !== 'playing') return state;
      return {
        ...state,
        time: Math.min(state.time + 1, 999),
      };
    }

    case 'REVEAL_CELL': {
      if (state.phase !== 'playing') return state;

      const { row, col } = action;
      const cell = state.board[row][col];
      if (cell.state !== 'hidden') return state;

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
        if (hasPowerUp(state, 'sixth-sense')) {
          newBoard = applySixthSense(newBoard, row, col);
        } else {
          newBoard = revealCell(newBoard, row, col);
        }

        // Apply Lucky Start after mines are placed (if not used yet this floor)
        if (hasPowerUp(state, 'lucky-start') && !state.run.luckyStartUsedThisFloor) {
          newBoard = applyLuckyStart(newBoard);
          newRun.luckyStartUsedThisFloor = true;
        }

        // Calculate danger cells if player has Danger Sense
        if (hasPowerUp(state, 'danger-sense')) {
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
      if (newBoard[row][col].isMine) {
        // Check for Iron Will
        if (hasPowerUp(state, 'iron-will') && state.run.ironWillAvailable) {
          // Iron Will saves the player! Mark the mine as flagged and continue
          newBoard = newBoard.map((r) =>
            r.map((c) => (c.row === row && c.col === col ? { ...c, state: 'flagged' as const } : c))
          );
          newRun.ironWillAvailable = false;
        } else {
          // Game over - start explosion animation
          newPhase = 'exploding';
          return {
            ...state,
            board: newBoard,
            isFirstClick: false,
            phase: newPhase,
            run: newRun,
            explodedCell: { row, col },
            minesRemaining: state.floorConfig.mines - countFlags(newBoard),
          };
        }
      } else if (checkFloorCleared(newBoard)) {
        // Floor cleared!
        newRun.score += calculateFloorClearBonus(newRun.currentFloor, state.time);

        if (isFinalFloor(newRun.currentFloor)) {
          // Victory!
          newPhase = 'victory';
        } else {
          // Move to draft phase
          newPhase = 'draft';
          const ownedIds = newRun.activePowerUps.map((p) => p.id);
          // For now, use empty unlocks - will be connected to stats later
          const availablePool = getAvailablePowerUps([]);
          newDraftOptions = selectDraftOptions(availablePool, ownedIds, 3);
        }
      }

      // Update danger cells after reveal
      if (hasPowerUp(state, 'danger-sense') && newPhase === 'playing') {
        newDangerCells = calculateDangerCells(newBoard);
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
      };
    }

    case 'TOGGLE_FLAG': {
      if (state.phase !== 'playing') return state;
      if (state.isFirstClick) return state; // Can't flag before first click

      const { row, col } = action;
      const cell = state.board[row][col];
      if (cell.state === 'revealed') return state;

      const newBoard = toggleFlag(state.board, row, col);

      return {
        ...state,
        board: newBoard,
        minesRemaining: state.floorConfig.mines - countFlags(newBoard),
      };
    }

    case 'CHORD_CLICK': {
      if (state.phase !== 'playing') return state;

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

      if (hitMine) {
        // Check for Iron Will
        if (hasPowerUp(state, 'iron-will') && state.run.ironWillAvailable) {
          // Iron Will protects from chord mine hits too
          // Find the mine that was hit and flag it
          finalBoard = newBoard.map((r) =>
            r.map((c) =>
              c.isMine && c.state === 'revealed' ? { ...c, state: 'flagged' as const } : c
            )
          );
          newRun.ironWillAvailable = false;
        } else {
          // Find which mine was hit for explosion animation
          let hitRow = row,
            hitCol = col;
          for (let r = 0; r < newBoard.length && hitRow === row; r++) {
            for (let c = 0; c < newBoard[0].length; c++) {
              if (newBoard[r][c].isMine && newBoard[r][c].state === 'revealed') {
                hitRow = r;
                hitCol = c;
                break;
              }
            }
          }
          newPhase = 'exploding';
          return {
            ...state,
            board: newBoard,
            phase: newPhase,
            run: newRun,
            explodedCell: { row: hitRow, col: hitCol },
            minesRemaining: state.floorConfig.mines - countFlags(newBoard),
          };
        }
      } else if (checkFloorCleared(newBoard)) {
        // Floor cleared!
        newRun.score += calculateFloorClearBonus(newRun.currentFloor, state.time);

        if (isFinalFloor(newRun.currentFloor)) {
          newPhase = 'victory';
        } else {
          newPhase = 'draft';
          const ownedIds = newRun.activePowerUps.map((p) => p.id);
          const availablePool = getAvailablePowerUps([]);
          newDraftOptions = selectDraftOptions(availablePool, ownedIds, 3);
        }
      }

      // Update danger cells
      let newDangerCells = state.dangerCells;
      if (hasPowerUp(state, 'danger-sense') && newPhase === 'playing') {
        newDangerCells = calculateDangerCells(finalBoard);
      }

      return {
        ...state,
        board: finalBoard,
        phase: newPhase,
        run: newRun,
        draftOptions: newDraftOptions,
        dangerCells: newDangerCells,
        minesRemaining: state.floorConfig.mines - countFlags(finalBoard),
      };
    }

    case 'USE_X_RAY': {
      if (state.phase !== 'playing') return state;
      if (!hasPowerUp(state, 'x-ray-vision')) return state;
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
        newRun.score += calculateFloorClearBonus(newRun.currentFloor, state.time);

        if (isFinalFloor(newRun.currentFloor)) {
          newPhase = 'victory';
        } else {
          newPhase = 'draft';
          const ownedIds = newRun.activePowerUps.map((p) => p.id);
          const availablePool = getAvailablePowerUps([]);
          newDraftOptions = selectDraftOptions(availablePool, ownedIds, 3);
        }
      }

      // Update danger cells
      let newDangerCells = state.dangerCells;
      if (hasPowerUp(state, 'danger-sense') && newPhase === 'playing') {
        newDangerCells = calculateDangerCells(newBoard);
      }

      return {
        ...state,
        board: newBoard,
        run: newRun,
        phase: newPhase,
        draftOptions: newDraftOptions,
        dangerCells: newDangerCells,
        minesRemaining: state.floorConfig.mines - countFlags(newBoard),
      };
    }

    case 'SELECT_POWER_UP': {
      if (state.phase !== 'draft') return state;

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
        phase: 'playing',
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
      if (state.phase !== 'draft') return state;

      // Set up next floor with bonus points
      const nextFloor = state.run.currentFloor + 1;
      const floorConfig = getFloorConfig(nextFloor, state.isMobile);
      const newBoard = createEmptyBoard(floorConfig);

      return {
        ...state,
        phase: 'playing',
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
      if (state.phase !== 'exploding') return state;

      // Reveal all mines and transition to run-over
      const finalBoard = revealAllMines(state.board);

      return {
        ...state,
        board: finalBoard,
        phase: 'run-over',
        explodedCell: null,
      };
    }

    default:
      return state;
  }
}

export function useRoguelikeState(isMobile: boolean = false) {
  const [state, dispatch] = useReducer(roguelikeReducer, isMobile, (mobile) =>
    createRoguelikeInitialState(mobile)
  );

  // Handle mobile state changes
  useEffect(() => {
    if (state.isMobile !== isMobile) {
      dispatch({ type: 'SET_MOBILE', isMobile });
    }
  }, [isMobile, state.isMobile]);

  // Timer effect
  useEffect(() => {
    if (state.phase !== 'playing') return;

    const interval = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.phase]);

  const startRun = useCallback(() => {
    dispatch({ type: 'START_RUN', isMobile });
  }, [isMobile]);

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
  };
}
