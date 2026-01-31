import { useState, useEffect, useCallback } from 'react';
import { PowerUpId, RoguelikeStats } from '../types';
import { UNLOCK_FLOOR_5_REWARD } from '../constants';

const STORAGE_KEY = 'minesweeper-roguelike-stats';

const DEFAULT_STATS: RoguelikeStats = {
  totalRuns: 0,
  bestFloor: 0,
  bestScore: 0,
  floorsCleared: 0,
  unlocks: [],
};

function loadStats(): RoguelikeStats {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...DEFAULT_STATS,
        ...parsed,
      };
    }
  } catch {
    // Ignore errors, use defaults
  }
  return DEFAULT_STATS;
}

function saveStats(stats: RoguelikeStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Ignore storage errors
  }
}

export function useRoguelikeStats() {
  const [stats, setStats] = useState<RoguelikeStats>(loadStats);

  // Sync with localStorage on mount
  useEffect(() => {
    setStats(loadStats());
  }, []);

  const recordRun = useCallback((floorReached: number, score: number) => {
    setStats((prev) => {
      const newUnlocks: PowerUpId[] = [...prev.unlocks];

      // Check for floor 5 unlock
      if (floorReached >= 5 && !newUnlocks.includes(UNLOCK_FLOOR_5_REWARD)) {
        newUnlocks.push(UNLOCK_FLOOR_5_REWARD);
      }

      const newStats: RoguelikeStats = {
        totalRuns: prev.totalRuns + 1,
        bestFloor: Math.max(prev.bestFloor, floorReached),
        bestScore: Math.max(prev.bestScore, score),
        floorsCleared: prev.floorsCleared + floorReached - 1, // Don't count current floor if died
        unlocks: newUnlocks,
      };

      saveStats(newStats);
      return newStats;
    });
  }, []);

  const resetStats = useCallback(() => {
    setStats(DEFAULT_STATS);
    saveStats(DEFAULT_STATS);
  }, []);

  return {
    stats,
    recordRun,
    resetStats,
  };
}
