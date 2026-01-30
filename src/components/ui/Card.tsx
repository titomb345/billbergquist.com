import { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  className?: string;
}

function Card({ children, className = '' }: CardProps) {
  const classes = [styles.card, className].filter(Boolean).join(' ');

  return <div className={classes}>{children}</div>;
}

interface GameCardProps {
  title: string;
  description: string;
  preview?: ReactNode;
  action?: ReactNode;
  locked?: boolean;
}

function GameCard({
  title,
  description,
  preview,
  action,
  locked = false,
}: GameCardProps) {
  return (
    <Card
      className={`${styles.gameCard} ${locked ? styles.locked : ''}`}
    >
      <div className={styles.preview}>
        {preview || <span className={styles.previewImage}>?</span>}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <div className={styles.action}>
        {locked ? (
          <span className={styles.lockedBadge}>Coming Soon</span>
        ) : (
          action
        )}
      </div>
    </Card>
  );
}

export { Card, GameCard };
export default Card;
