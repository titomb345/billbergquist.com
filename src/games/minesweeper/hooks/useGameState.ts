import { useReducer, useEffect, useCallback } from 'react';
import {
  GameState,
  GameAction,
  GameStatus,
  Difficulty,
  DIFFICULTY_CONFIGS,
} from '../types';
import {
  createEmptyBoard,
  createInitialState,
  placeMines,
  revealCell,
  toggleFlag,
  chordReveal,
  checkWin,
  revealAllMines,
  countFlags,
} from '../logic/gameLogic';

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'NEW_GAME': {
      const difficulty = action.difficulty ?? state.difficulty;
      return createInitialState(difficulty);
    }

    case 'TICK': {
      if (state.status !== 'playing') return state;
      return {
        ...state,
        time: Math.min(state.time + 1, 999),
      };
    }

    case 'REVEAL_CELL': {
      const { row, col } = action;
      if (state.status === 'won' || state.status === 'lost') return state;

      const cell = state.board[row][col];
      if (cell.state !== 'hidden') return state;

      let newBoard = state.board;
      let newStatus: GameStatus = state.status;
      let isFirstClick = state.isFirstClick;

      // Handle first click - place mines after
      if (state.isFirstClick) {
        const config = DIFFICULTY_CONFIGS[state.difficulty];
        newBoard = placeMines(
          createEmptyBoard(config),
          config,
          row,
          col
        );
        isFirstClick = false;
        newStatus = 'playing';
      }

      // Reveal the cell
      newBoard = revealCell(newBoard, row, col);

      // Check for mine hit
      if (newBoard[row][col].isMine) {
        newBoard = revealAllMines(newBoard);
        newStatus = 'lost';
      } else if (checkWin(newBoard)) {
        newStatus = 'won';
      }

      return {
        ...state,
        board: newBoard,
        status: newStatus,
        isFirstClick,
        minesRemaining:
          DIFFICULTY_CONFIGS[state.difficulty].mines - countFlags(newBoard),
      };
    }

    case 'TOGGLE_FLAG': {
      const { row, col } = action;
      if (state.status === 'won' || state.status === 'lost') return state;
      if (state.status === 'idle') return state; // Can't flag before first click

      const cell = state.board[row][col];
      if (cell.state === 'revealed') return state;

      const newBoard = toggleFlag(state.board, row, col);
      const flagCount = countFlags(newBoard);

      return {
        ...state,
        board: newBoard,
        minesRemaining: DIFFICULTY_CONFIGS[state.difficulty].mines - flagCount,
      };
    }

    case 'CHORD_CLICK': {
      const { row, col } = action;
      if (state.status !== 'playing') return state;

      const { board: newBoard, hitMine } = chordReveal(state.board, row, col);

      let newStatus: GameStatus = state.status;
      let finalBoard = newBoard;

      if (hitMine) {
        finalBoard = revealAllMines(newBoard);
        newStatus = 'lost';
      } else if (checkWin(newBoard)) {
        newStatus = 'won';
      }

      return {
        ...state,
        board: finalBoard,
        status: newStatus,
        minesRemaining:
          DIFFICULTY_CONFIGS[state.difficulty].mines - countFlags(finalBoard),
      };
    }

    default:
      return state;
  }
}

export function useGameState(initialDifficulty: Difficulty = 'beginner') {
  const [state, dispatch] = useReducer(
    gameReducer,
    initialDifficulty,
    createInitialState
  );

  // Timer effect
  useEffect(() => {
    if (state.status !== 'playing') return;

    const interval = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.status]);

  const revealCell = useCallback((row: number, col: number) => {
    dispatch({ type: 'REVEAL_CELL', row, col });
  }, []);

  const toggleFlag = useCallback((row: number, col: number) => {
    dispatch({ type: 'TOGGLE_FLAG', row, col });
  }, []);

  const chordClick = useCallback((row: number, col: number) => {
    dispatch({ type: 'CHORD_CLICK', row, col });
  }, []);

  const newGame = useCallback((difficulty?: Difficulty) => {
    dispatch({ type: 'NEW_GAME', difficulty });
  }, []);

  return {
    state,
    revealCell,
    toggleFlag,
    chordClick,
    newGame,
  };
}
