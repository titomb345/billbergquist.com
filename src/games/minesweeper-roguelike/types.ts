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

export function getDifficultyConfig(difficulty: Difficulty, isMobile: boolean): DifficultyConfig {
  return isMobile ? MOBILE_DIFFICULTY_CONFIGS[difficulty] : DIFFICULTY_CONFIGS[difficulty];
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

// ==================== ROGUELIKE TYPES ====================

// Power-up identifiers
export type PowerUpId =
  | 'iron-will'
  | 'x-ray-vision'
  | 'lucky-start'
  | 'sixth-sense'
  | 'danger-sense'
  | 'mine-detector'; // Unlockable

export interface PowerUp {
  id: PowerUpId;
  name: string;
  description: string;
  icon: string;
  type: 'passive' | 'active';
  usesPerFloor?: number; // For active abilities
}

// Floor configuration (replaces Difficulty for roguelike mode)
export interface FloorConfig {
  floor: number;
  rows: number;
  cols: number;
  mines: number;
}

// Game phases for roguelike mode
export type GamePhase = 'start' | 'playing' | 'floor-clear' | 'draft' | 'exploding' | 'run-over' | 'victory';

// Run state tracks current roguelike run
export interface RunState {
  currentFloor: number;
  score: number;
  activePowerUps: PowerUp[];
  ironWillAvailable: boolean;
  xRayUsedThisFloor: boolean;
  luckyStartUsedThisFloor: boolean;
}

// Meta-progression stats persisted to localStorage
export interface RoguelikeStats {
  totalRuns: number;
  bestFloor: number;
  bestScore: number;
  floorsCleared: number;
  unlocks: string[];
}

// Full roguelike game state
export interface RoguelikeGameState {
  phase: GamePhase;
  board: Cell[][];
  floorConfig: FloorConfig;
  minesRemaining: number;
  time: number;
  isFirstClick: boolean;
  isMobile: boolean;
  run: RunState;
  draftOptions: PowerUp[];
  dangerCells: Set<string>; // Cell keys "row,col" that have danger glow
  explodedCell: { row: number; col: number } | null; // Cell that triggered explosion
}

// Roguelike-specific actions
export type RoguelikeAction =
  | { type: 'START_RUN'; isMobile: boolean }
  | { type: 'GO_TO_START' }
  | { type: 'REVEAL_CELL'; row: number; col: number }
  | { type: 'TOGGLE_FLAG'; row: number; col: number }
  | { type: 'CHORD_CLICK'; row: number; col: number }
  | { type: 'USE_X_RAY'; row: number; col: number }
  | { type: 'SELECT_POWER_UP'; powerUp: PowerUp }
  | { type: 'SKIP_DRAFT'; bonusPoints: number }
  | { type: 'TICK' }
  | { type: 'SET_MOBILE'; isMobile: boolean }
  | { type: 'EXPLOSION_COMPLETE' }
  | { type: 'FLOOR_CLEAR_COMPLETE' };
