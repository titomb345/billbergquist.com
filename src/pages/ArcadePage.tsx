import { useNavigate } from 'react-router-dom';
import GlowText from '../components/ui/GlowText';
import { GameCard } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { MinesweeperRoguelikePreview } from '../games/minesweeper-roguelike';
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
          title="Minesweeper: Descent"
          description="Roguelike minesweeper. Descend 10 floors of escalating danger. Collect power-ups to survive."
          preview={<MinesweeperRoguelikePreview />}
          action={
            <Button
              variant="primary"
              onClick={() => navigate('/arcade/descent')}
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
