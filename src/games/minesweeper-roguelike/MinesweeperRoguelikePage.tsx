import { useNavigate } from 'react-router-dom';
import { ArcadeCabinet } from '../../components/arcade';
import MinesweeperRoguelike from './MinesweeperRoguelike';

function MinesweeperRoguelikePage() {
  const navigate = useNavigate();

  return (
    <ArcadeCabinet title="MINESWEEPER: DESCENT" color="magenta" onBack={() => navigate('/arcade')}>
      <MinesweeperRoguelike />
    </ArcadeCabinet>
  );
}

export default MinesweeperRoguelikePage;
