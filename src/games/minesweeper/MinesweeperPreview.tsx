import styles from './MinesweeperPreview.module.css';

function MinesweeperPreview() {
  // Mini representation of a minesweeper board
  const cells = [
    '', '', '1', '', '',
    '1', '1', '2', '1', '1',
    '*', '1', '', '1', '*',
    '1', '1', '', '1', '1',
    '', '', '', '', '',
  ];

  return (
    <div className={styles.minesweeperPreview}>
      {cells.map((cell, i) => (
        <div
          key={i}
          className={`${styles.mineCell} ${cell ? styles.revealed : ''} ${cell === '*' ? styles.mine : ''} ${cell && cell !== '*' ? styles.number : ''}`}
        >
          {cell === '*' ? '💣' : cell}
        </div>
      ))}
    </div>
  );
}

export default MinesweeperPreview;
