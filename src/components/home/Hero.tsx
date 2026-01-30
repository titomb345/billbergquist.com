import GlowText from '../ui/GlowText';
import Button from '../ui/Button';
import styles from './Hero.module.css';

interface HeroProps {
  onEnterArcade?: () => void;
}

function Hero({ onEnterArcade }: HeroProps) {
  const handleClick = () => {
    if (onEnterArcade) {
      onEnterArcade();
    } else {
      const gamesSection = document.getElementById('games');
      gamesSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <GlowText
          size="xlarge"
          color="cyan"
          animated
          className={styles.title}
        >
          BILL BERGQUIST
        </GlowText>
        <p className={styles.subtitle}>
          <span className={styles.subtitleBracket}>&lt;</span>
          {' Arcade Hub '}
          <span className={styles.subtitleBracket}>/&gt;</span>
        </p>
        <div className={styles.cta}>
          <Button variant="primary" size="large" onClick={handleClick}>
            Enter Arcade
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
