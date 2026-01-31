import { Cell, GameState, Difficulty, DifficultyConfig, getDifficultyConfig } from '../types';

export function createEmptyBoard(config: DifficultyConfig): Cell[][] {
  const board: Cell[][] = [];
  for (let row = 0; row < config.rows; row++) {
    const rowCells: Cell[] = [];
    for (let col = 0; col < config.cols; col++) {
      rowCells.push({
        row,
        col,
        isMine: false,
        state: 'hidden',
        adjacentMines: 0,
      });
    }
    board.push(rowCells);
  }
  return board;
}

export function placeMines(
  board: Cell[][],
  config: DifficultyConfig,
  excludeRow: number,
  excludeCol: number
): Cell[][] {
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
  const excludeSet = new Set<string>();

  // Exclude the clicked cell and its neighbors
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const r = excludeRow + dr;
      const c = excludeCol + dc;
      if (r >= 0 && r < config.rows && c >= 0 && c < config.cols) {
        excludeSet.add(`${r},${c}`);
      }
    }
  }

  // Get all valid positions for mines
  const validPositions: [number, number][] = [];
  for (let row = 0; row < config.rows; row++) {
    for (let col = 0; col < config.cols; col++) {
      if (!excludeSet.has(`${row},${col}`)) {
        validPositions.push([row, col]);
      }
    }
  }

  // Shuffle and pick mine positions
  for (let i = validPositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [validPositions[i], validPositions[j]] = [validPositions[j], validPositions[i]];
  }

  const minePositions = validPositions.slice(0, config.mines);
  for (const [row, col] of minePositions) {
    newBoard[row][col].isMine = true;
  }

  return calculateAdjacentMines(newBoard);
}

export function calculateAdjacentMines(board: Cell[][]): Cell[][] {
  const rows = board.length;
  const cols = board[0].length;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (board[row][col].isMine) continue;

      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const r = row + dr;
          const c = col + dc;
          if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c].isMine) {
            count++;
          }
        }
      }
      board[row][col].adjacentMines = count;
    }
  }

  return board;
}

export function revealCell(board: Cell[][], row: number, col: number): Cell[][] {
  const newBoard = board.map((r) => r.map((cell) => ({ ...cell })));
  const cell = newBoard[row][col];

  if (cell.state !== 'hidden') return newBoard;

  cell.state = 'revealed';

  // If it's a mine, just reveal it
  if (cell.isMine) return newBoard;

  // If it has no adjacent mines, cascade reveal
  if (cell.adjacentMines === 0) {
    return revealCascade(newBoard, row, col);
  }

  return newBoard;
}

export function revealCascade(board: Cell[][], startRow: number, startCol: number): Cell[][] {
  const rows = board.length;
  const cols = board[0].length;
  const stack: [number, number][] = [[startRow, startCol]];
  const visited = new Set<string>();

  while (stack.length > 0) {
    const [row, col] = stack.pop()!;
    const key = `${row},${col}`;

    if (visited.has(key)) continue;
    visited.add(key);

    const cell = board[row][col];
    if (cell.state === 'flagged' || cell.isMine) continue;

    cell.state = 'revealed';

    // Only continue cascading if this cell has no adjacent mines
    if (cell.adjacentMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const r = row + dr;
          const c = col + dc;
          if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c].state === 'hidden') {
            stack.push([r, c]);
          }
        }
      }
    }
  }

  return board;
}

export function toggleFlag(board: Cell[][], row: number, col: number): Cell[][] {
  const newBoard = board.map((r) => r.map((cell) => ({ ...cell })));
  const cell = newBoard[row][col];

  if (cell.state === 'revealed') return newBoard;

  cell.state = cell.state === 'flagged' ? 'hidden' : 'flagged';
  return newBoard;
}

export function chordReveal(
  board: Cell[][],
  row: number,
  col: number
): { board: Cell[][]; hitMine: boolean } {
  const cell = board[row][col];

  // Only works on revealed cells with a number
  if (cell.state !== 'revealed' || cell.adjacentMines === 0) {
    return { board, hitMine: false };
  }

  const rows = board.length;
  const cols = board[0].length;

  // Count adjacent flags
  let flagCount = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const r = row + dr;
      const c = col + dc;
      if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c].state === 'flagged') {
        flagCount++;
      }
    }
  }

  // If flag count doesn't match, do nothing
  if (flagCount !== cell.adjacentMines) {
    return { board, hitMine: false };
  }

  // Reveal all adjacent hidden cells
  let newBoard = board.map((r) => r.map((c) => ({ ...c })));
  let hitMine = false;

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const r = row + dr;
      const c = col + dc;
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        const adjacentCell = newBoard[r][c];
        if (adjacentCell.state === 'hidden') {
          if (adjacentCell.isMine) {
            hitMine = true;
            adjacentCell.state = 'revealed';
          } else {
            newBoard = revealCell(newBoard, r, c);
          }
        }
      }
    }
  }

  return { board: newBoard, hitMine };
}

export function checkWin(board: Cell[][]): boolean {
  for (const row of board) {
    for (const cell of row) {
      // If there's a non-mine cell that's not revealed, game isn't won yet
      if (!cell.isMine && cell.state !== 'revealed') {
        return false;
      }
    }
  }
  return true;
}

export function revealAllMines(board: Cell[][]): Cell[][] {
  return board.map((row) =>
    row.map((cell) => ({
      ...cell,
      state: cell.isMine ? 'revealed' : cell.state,
    }))
  );
}

export function countFlags(board: Cell[][]): number {
  let count = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell.state === 'flagged') count++;
    }
  }
  return count;
}

export function createInitialState(difficulty: Difficulty, isMobile: boolean = false): GameState {
  const config = getDifficultyConfig(difficulty, isMobile);
  return {
    board: createEmptyBoard(config),
    difficulty,
    status: 'idle',
    minesRemaining: config.mines,
    time: 0,
    isFirstClick: true,
    isMobile,
  };
}
