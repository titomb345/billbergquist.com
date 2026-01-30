import { Cell as CellType } from '../types';
import Cell from './Cell';

interface BoardProps {
  board: CellType[][];
  onReveal: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
  onChord: (row: number, col: number) => void;
  gameOver: boolean;
}

function Board({ board, onReveal, onFlag, onChord, gameOver }: BoardProps) {
  return (
    <div
      className="minesweeper-board"
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
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Board;
