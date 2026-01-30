import { useNavigate } from 'react-router-dom';
import Minesweeper from '../components/minesweeper/Minesweeper';
import styles from './MinesweeperPage.module.css';

function MinesweeperPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => navigate('/')}
          type="button"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Arcade
        </button>
        <h1 className={styles.title}>MINESWEEPER</h1>
        <div style={{ width: '120px' }} />
      </div>
      <div className={styles.crtFrame}>
        <div className={styles.gameContainer}>
          <Minesweeper />
        </div>
        <div className={styles.powerLed} />
      </div>
    </div>
  );
}

export default MinesweeperPage;
