import { useNavigate } from 'react-router-dom';
import GlowText from '../components/ui/GlowText';
import { GameCard } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { MinesweeperPreview } from '../games/minesweeper';
import styles from './ArcadePage.module.css';

function ArcadePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <GlowText size="large" color="magenta" animated className={styles.title}>
          ARCADE
        </GlowText>
        <p className={styles.subtitle}>
          A collection of browser-based games built for fun.
        </p>
      </header>

      <main className={styles.grid}>
        <GameCard
          title="Minesweeper"
          description="Classic puzzle game. Clear the board without hitting any mines. Windows 95 nostalgia included."
          preview={<MinesweeperPreview />}
          action={
            <Button
              variant="primary"
              onClick={() => navigate('/arcade/minesweeper')}
            >
              Play Now
            </Button>
          }
        />
      </main>
    </div>
  );
}

export default ArcadePage;
