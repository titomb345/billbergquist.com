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
}: BoardProps) {
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
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Board;
