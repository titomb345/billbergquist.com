import { Cell as CellType } from '../types';
import Cell from './Cell';

interface BoardProps {
  board: CellType[][];
  onReveal: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
  onChord: (row: number, col: number) => void;
  gameOver: boolean;
  dangerCells?: Set<string>;
  xRayMode?: boolean;
  onXRay?: (row: number, col: number) => void;
  onCellHover?: (row: number, col: number) => void;
  onCellHoverEnd?: () => void;
  detectorCenter?: { row: number; col: number } | null;
  chordHighlightCells?: Set<string>;
  onChordHighlightStart?: (row: number, col: number) => void;
  onChordHighlightEnd?: () => void;
}

function Board({
  board,
  onReveal,
  onFlag,
  onChord,
  gameOver,
  dangerCells,
  xRayMode = false,
  onXRay,
  onCellHover,
  onCellHoverEnd,
  detectorCenter,
  chordHighlightCells,
  onChordHighlightStart,
  onChordHighlightEnd,
}: BoardProps) {
  // Check if a cell is within the 5x5 detector zone
  const isInDetectorZone = (row: number, col: number): boolean => {
    if (!detectorCenter) return false;
    const rowDiff = Math.abs(row - detectorCenter.row);
    const colDiff = Math.abs(col - detectorCenter.col);
    return rowDiff <= 2 && colDiff <= 2;
  };

  return (
    <div
      className={`minesweeper-board ${xRayMode ? 'xray-mode' : ''}`}
      onContextMenu={(e) => e.preventDefault()}
    >
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell) => (
            <Cell
              key={`${cell.row}-${cell.col}`}
              cell={cell}
              onReveal={onReveal}
              onFlag={onFlag}
              onChord={onChord}
              gameOver={gameOver}
              hasDanger={dangerCells?.has(`${cell.row},${cell.col}`)}
              xRayMode={xRayMode}
              onXRay={onXRay}
              onHover={onCellHover}
              onHoverEnd={onCellHoverEnd}
              inDetectorZone={isInDetectorZone(cell.row, cell.col)}
              isChordHighlighted={chordHighlightCells?.has(`${cell.row},${cell.col}`)}
              onChordHighlightStart={onChordHighlightStart}
              onChordHighlightEnd={onChordHighlightEnd}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Board;
