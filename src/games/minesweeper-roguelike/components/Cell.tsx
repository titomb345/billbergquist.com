import { memo } from 'react';
import { Cell as CellType, CellState } from '../types';
import { MineIcon, FlagIcon } from './icons';

interface CellProps {
  cell: CellType;
  onReveal: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
  onChord: (row: number, col: number) => void;
  gameOver: boolean;
  hasDanger?: boolean; // For Danger Sense power-up
  xRayMode?: boolean; // For X-Ray Vision targeting
  onXRay?: (row: number, col: number) => void;
}

function CellComponent({
  cell,
  onReveal,
  onFlag,
  onChord,
  gameOver,
  hasDanger = false,
  xRayMode = false,
  onXRay,
}: CellProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (gameOver) return;

    // X-Ray mode takes precedence
    if (xRayMode && onXRay) {
      onXRay(cell.row, cell.col);
      return;
    }

    if (cell.state === CellState.Revealed && cell.adjacentMines > 0) {
      onChord(cell.row, cell.col);
    } else if (cell.state === CellState.Hidden) {
      onReveal(cell.row, cell.col);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (gameOver) return;
    onFlag(cell.row, cell.col);
  };

  const handleMiddleClick = (e: React.MouseEvent) => {
    if (e.button === 1) {
      e.preventDefault();
      if (gameOver) return;
      if (cell.state === CellState.Revealed && cell.adjacentMines > 0) {
        onChord(cell.row, cell.col);
      }
    }
  };

  const getClassName = () => {
    const classes = ['cell'];

    if (cell.state === CellState.Hidden) {
      classes.push('cell-hidden');
      if (hasDanger) {
        classes.push('cell-danger');
      }
      if (xRayMode) {
        classes.push('cell-xray-target');
      }
    } else if (cell.state === CellState.Flagged) {
      classes.push('cell-flagged');
    } else if (cell.state === CellState.Revealed) {
      classes.push('cell-revealed');
      if (cell.isMine) {
        classes.push('cell-mine');
      } else if (cell.adjacentMines > 0) {
        classes.push(`cell-${cell.adjacentMines}`);
      }
    }

    return classes.join(' ');
  };

  const getContent = () => {
    if (cell.state === CellState.Flagged) {
      return <FlagIcon />;
    }
    if (cell.state === CellState.Revealed) {
      if (cell.isMine) {
        return <MineIcon />;
      }
      if (cell.adjacentMines > 0) {
        return cell.adjacentMines;
      }
    }
    return null;
  };

  return (
    <div
      className={getClassName()}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMiddleClick}
    >
      {getContent()}
    </div>
  );
}

// Memoize Cell to prevent re-renders when props haven't changed
// On a 12x12 board, this prevents 144 unnecessary re-renders per state change
const Cell = memo(CellComponent, (prev, next) => {
  return (
    prev.cell.state === next.cell.state &&
    prev.cell.adjacentMines === next.cell.adjacentMines &&
    prev.cell.isMine === next.cell.isMine &&
    prev.gameOver === next.gameOver &&
    prev.hasDanger === next.hasDanger &&
    prev.xRayMode === next.xRayMode
  );
});

export default Cell;
