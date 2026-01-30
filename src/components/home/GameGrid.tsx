import { useNavigate } from 'react-router-dom';
import { GameCard } from '../ui/Card';
import GlowText from '../ui/GlowText';
import Button from '../ui/Button';
import { MinesweeperPreview } from '../../games/minesweeper';
import styles from './GameGrid.module.css';

function GameGrid() {
  const navigate = useNavigate();

  return (
    <section id="games" className={styles.section}>
      <GlowText
        as="h2"
        size="medium"
        color="magenta"
        className={styles.sectionTitle}
      >
        ARCADE
      </GlowText>
      <div className={styles.grid}>
        <GameCard
          title="Minesweeper"
          description="Classic puzzle game. Clear the board without hitting any mines. Windows 95 nostalgia included."
          preview={<MinesweeperPreview />}
          action={
            <Button
              variant="primary"
              onClick={() => navigate('/minesweeper')}
            >
              Play Now
            </Button>
          }
        />
      </div>
    </section>
  );
}

export default GameGrid;
