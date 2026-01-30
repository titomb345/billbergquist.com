export type CellState = 'hidden' | 'revealed' | 'flagged';

export interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  state: CellState;
  adjacentMines: number;
}

export type Difficulty = 'beginner' | 'intermediate' | 'expert';

export interface DifficultyConfig {
  rows: number;
  cols: number;
  mines: number;
}

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 },
};

// Mobile-optimized configs: swap rows/cols for expert to make it taller/narrower
export const MOBILE_DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 30, cols: 16, mines: 99 }, // Swapped: 16×30 → 30×16
};

export function getDifficultyConfig(
  difficulty: Difficulty,
  isMobile: boolean
): DifficultyConfig {
  return isMobile
    ? MOBILE_DIFFICULTY_CONFIGS[difficulty]
    : DIFFICULTY_CONFIGS[difficulty];
}

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export interface GameState {
  board: Cell[][];
  difficulty: Difficulty;
  status: GameStatus;
  minesRemaining: number;
  time: number;
  isFirstClick: boolean;
  isMobile: boolean;
}

export type GameAction =
  | { type: 'REVEAL_CELL'; row: number; col: number }
  | { type: 'TOGGLE_FLAG'; row: number; col: number }
  | { type: 'CHORD_CLICK'; row: number; col: number }
  | { type: 'NEW_GAME'; difficulty?: Difficulty; isMobile?: boolean }
  | { type: 'TICK' };
