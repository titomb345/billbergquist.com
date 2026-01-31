import { FloorConfig, PowerUp, PowerUpId } from './types';

// Floor configurations - escalate from floor 1 (6x6, 4 mines) to floor 10 (12x12, 40 mines)
export const FLOOR_CONFIGS: FloorConfig[] = [
  { floor: 1, rows: 6, cols: 6, mines: 4 },
  { floor: 2, rows: 7, cols: 7, mines: 6 },
  { floor: 3, rows: 8, cols: 8, mines: 10 },
  { floor: 4, rows: 8, cols: 8, mines: 12 },
  { floor: 5, rows: 9, cols: 9, mines: 15 },
  { floor: 6, rows: 9, cols: 9, mines: 18 },
  { floor: 7, rows: 10, cols: 10, mines: 22 },
  { floor: 8, rows: 10, cols: 10, mines: 28 },
  { floor: 9, rows: 11, cols: 11, mines: 34 },
  { floor: 10, rows: 12, cols: 12, mines: 40 },
];

// Mobile floor configs - keep boards more square/portrait-oriented
export const MOBILE_FLOOR_CONFIGS: FloorConfig[] = [
  { floor: 1, rows: 6, cols: 6, mines: 4 },
  { floor: 2, rows: 7, cols: 7, mines: 6 },
  { floor: 3, rows: 8, cols: 8, mines: 10 },
  { floor: 4, rows: 9, cols: 8, mines: 12 },
  { floor: 5, rows: 10, cols: 8, mines: 15 },
  { floor: 6, rows: 10, cols: 9, mines: 18 },
  { floor: 7, rows: 11, cols: 9, mines: 22 },
  { floor: 8, rows: 12, cols: 9, mines: 28 },
  { floor: 9, rows: 12, cols: 10, mines: 34 },
  { floor: 10, rows: 13, cols: 10, mines: 40 },
];

export function getFloorConfig(floor: number, isMobile: boolean): FloorConfig {
  const configs = isMobile ? MOBILE_FLOOR_CONFIGS : FLOOR_CONFIGS;
  const index = Math.min(floor - 1, configs.length - 1);
  return configs[index];
}

// MVP Power-ups pool
export const POWER_UP_POOL: PowerUp[] = [
  {
    id: 'iron-will',
    name: 'Iron Will',
    description: 'Survive one mine click (once per run)',
    icon: '🛡️',
    type: 'passive',
  },
  {
    id: 'x-ray-vision',
    name: 'X-Ray Vision',
    description: 'Reveal a 3×3 area safely (once per floor)',
    icon: '👁️',
    type: 'active',
    usesPerFloor: 1,
  },
  {
    id: 'lucky-start',
    name: 'Lucky Start',
    description: 'Reveals 3 extra safe cells in unexplored areas',
    icon: '🍀',
    type: 'passive',
  },
  {
    id: 'sixth-sense',
    name: 'Sixth Sense',
    description: 'First click triggers the nearest big cascade',
    icon: '✨',
    type: 'passive',
  },
  {
    id: 'danger-sense',
    name: 'Danger Sense',
    description: 'Up to 3 cells near 3+ mines have a subtle glow',
    icon: '⚠️',
    type: 'passive',
  },
];

// Unlockable power-up (reach floor 5)
export const MINE_DETECTOR_POWER_UP: PowerUp = {
  id: 'mine-detector',
  name: 'Mine Detector',
  description: 'Shows exact mine count in a 5×5 area around cursor',
  icon: '📡',
  type: 'passive',
};

// Scoring constants
export const SCORING = {
  BASE_CELL_REVEAL: 10, // Points per cell revealed
  FLOOR_CLEAR_BONUS: 100, // Bonus per floor cleared
  FLOOR_MULTIPLIER: 1.5, // Score multiplier increases per floor
  TIME_BONUS_THRESHOLD: 60, // Seconds under which time bonus kicks in
  TIME_BONUS_MULTIPLIER: 2, // Bonus multiplier for fast clears
};

// Look up a power-up by ID from all available powerups
export function getPowerUpById(id: PowerUpId): PowerUp | null {
  // Check the main pool first
  const fromPool = POWER_UP_POOL.find((p) => p.id === id);
  if (fromPool) return fromPool;

  // Check unlockable powerups
  if (MINE_DETECTOR_POWER_UP.id === id) return MINE_DETECTOR_POWER_UP;

  return null;
}

// Get available power-ups based on unlocks
export function getAvailablePowerUps(unlocks: PowerUpId[]): PowerUp[] {
  const pool = [...POWER_UP_POOL];
  if (unlocks.includes('mine-detector')) {
    pool.push(MINE_DETECTOR_POWER_UP);
  }
  return pool;
}

// Select N random power-ups for draft (excluding already owned)
export function selectDraftOptions(
  availablePool: PowerUp[],
  ownedIds: PowerUpId[],
  count: number = 3
): PowerUp[] {
  const filteredPool = availablePool.filter((p) => !ownedIds.includes(p.id));

  // Shuffle using Fisher-Yates
  const shuffled = [...filteredPool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}

export const MAX_FLOOR = 10;
export const UNLOCK_FLOOR_5_REWARD: PowerUpId = 'mine-detector';
