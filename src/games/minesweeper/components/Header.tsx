import { GameStatus } from '../types';
import { SmileyIcon } from './icons';

interface HeaderProps {
  minesRemaining: number;
  time: number;
  status: GameStatus;
  onNewGame: () => void;
}

function Header({ minesRemaining, time, status, onNewGame }: HeaderProps) {
  const formatNumber = (num: number): string => {
    const clamped = Math.max(-99, Math.min(999, num));
    if (clamped < 0) {
      return '-' + String(Math.abs(clamped)).padStart(2, '0');
    }
    return String(clamped).padStart(3, '0');
  };

  return (
    <div className="minesweeper-header">
      <div className="led-display">{formatNumber(minesRemaining)}</div>
      <button className="smiley-button" onClick={onNewGame}>
        <SmileyIcon status={status} size={24} />
      </button>
      <div className="led-display">{formatNumber(time)}</div>
    </div>
  );
}

export default Header;
