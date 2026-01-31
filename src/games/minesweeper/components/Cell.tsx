import { Cell as CellType } from '../types';
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

function Cell({
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

    if (cell.state === 'revealed' && cell.adjacentMines > 0) {
      onChord(cell.row, cell.col);
    } else if (cell.state === 'hidden') {
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
      if (cell.state === 'revealed' && cell.adjacentMines > 0) {
        onChord(cell.row, cell.col);
      }
    }
  };

  const getClassName = () => {
    const classes = ['cell'];

    if (cell.state === 'hidden') {
      classes.push('cell-hidden');
      if (hasDanger) {
        classes.push('cell-danger');
      }
      if (xRayMode) {
        classes.push('cell-xray-target');
      }
    } else if (cell.state === 'flagged') {
      classes.push('cell-flagged');
    } else if (cell.state === 'revealed') {
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
    if (cell.state === 'flagged') {
      return <FlagIcon />;
    }
    if (cell.state === 'revealed') {
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

export default Cell;
