import { Link } from 'react-router-dom';
import Minesweeper from '../components/minesweeper/Minesweeper';

function MinesweeperPage() {
  return (
    <div style={{ padding: '20px' }}>
      <Link to="/" style={{ marginBottom: '20px', display: 'inline-block' }}>
        &larr; Back to Home
      </Link>
      <Minesweeper />
    </div>
  );
}

export default MinesweeperPage;
