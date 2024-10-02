import { Stack, Typography } from '@mui/material';
import { usePageTitle, useShowGenerations } from '../../hooks';
import Generations from './generations';
import Inputs from '../../components/inputs';
import { useContext } from 'react';
import { InputsContext } from '../../components/inputs-context';

export function NflGenerator() {
  const { playerName, setPlayerName, injury, setInjury, dayOfWeek, setDayOfWeek } =
    useContext(InputsContext);
  const { showGenerations } = useShowGenerations(playerName);

  usePageTitle('Sports Shortcuts | NFL');

  return (
    <Stack spacing={1.5}>
      <Typography variant="h6">NFL Generator</Typography>
      <Stack spacing={3}>
        <Inputs
          playerName={playerName}
          setPlayerName={setPlayerName}
          injury={injury}
          setInjury={setInjury}
          dayOfWeek={dayOfWeek}
          setDayOfWeek={setDayOfWeek}
        />
        {showGenerations && (
          <Generations playerName={playerName} injury={injury} dayOfWeek={dayOfWeek} />
        )}
      </Stack>
    </Stack>
  );
}

export default NflGenerator;
