import { useNavigate } from 'react-router-dom';
import { ArcadeCabinet } from '../../components/arcade';
import Minesweeper from './Minesweeper';

function MinesweeperPage() {
  const navigate = useNavigate();

  return (
    <ArcadeCabinet
      title="MINESWEEPER"
      color="magenta"
      onBack={() => navigate('/arcade')}
    >
      <Minesweeper />
    </ArcadeCabinet>
  );
}

export default MinesweeperPage;
