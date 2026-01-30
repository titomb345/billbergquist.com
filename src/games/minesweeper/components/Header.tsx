import { GameStatus } from '../types';

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

  const getSmiley = (): string => {
    switch (status) {
      case 'won':
        return '😎';
      case 'lost':
        return '😵';
      default:
        return '🙂';
    }
  };

  return (
    <div className="minesweeper-header">
      <div className="led-display">{formatNumber(minesRemaining)}</div>
      <button className="smiley-button" onClick={onNewGame}>
        {getSmiley()}
      </button>
      <div className="led-display">{formatNumber(time)}</div>
    </div>
  );
}

export default Header;
