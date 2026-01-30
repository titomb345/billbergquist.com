import { useReducer, useEffect, useCallback } from 'react';
import {
  GameState,
  GameAction,
  GameStatus,
  Difficulty,
  getDifficultyConfig,
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
      const isMobile = action.isMobile ?? state.isMobile;
      return createInitialState(difficulty, isMobile);
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
        const config = getDifficultyConfig(state.difficulty, state.isMobile);
        newBoard = placeMines(createEmptyBoard(config), config, row, col);
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

      const config = getDifficultyConfig(state.difficulty, state.isMobile);
      return {
        ...state,
        board: newBoard,
        status: newStatus,
        isFirstClick,
        minesRemaining: config.mines - countFlags(newBoard),
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
      const config = getDifficultyConfig(state.difficulty, state.isMobile);

      return {
        ...state,
        board: newBoard,
        minesRemaining: config.mines - flagCount,
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

      const config = getDifficultyConfig(state.difficulty, state.isMobile);
      return {
        ...state,
        board: finalBoard,
        status: newStatus,
        minesRemaining: config.mines - countFlags(finalBoard),
      };
    }

    default:
      return state;
  }
}

export function useGameState(
  initialDifficulty: Difficulty = 'beginner',
  isMobile: boolean = false
) {
  const [state, dispatch] = useReducer(
    gameReducer,
    { difficulty: initialDifficulty, isMobile },
    ({ difficulty, isMobile }) => createInitialState(difficulty, isMobile)
  );

  // Reinitialize game when isMobile changes
  useEffect(() => {
    if (state.isMobile !== isMobile) {
      dispatch({ type: 'NEW_GAME', isMobile });
    }
  }, [isMobile, state.isMobile]);

  // Timer effect
  useEffect(() => {
    if (state.status !== 'playing') return;

    const interval = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.status]);

  const revealCellAction = useCallback((row: number, col: number) => {
    dispatch({ type: 'REVEAL_CELL', row, col });
  }, []);

  const toggleFlagAction = useCallback((row: number, col: number) => {
    dispatch({ type: 'TOGGLE_FLAG', row, col });
  }, []);

  const chordClick = useCallback((row: number, col: number) => {
    dispatch({ type: 'CHORD_CLICK', row, col });
  }, []);

  const newGame = useCallback(
    (difficulty?: Difficulty) => {
      dispatch({ type: 'NEW_GAME', difficulty, isMobile });
    },
    [isMobile]
  );

  return {
    state,
    revealCell: revealCellAction,
    toggleFlag: toggleFlagAction,
    chordClick,
    newGame,
  };
}
