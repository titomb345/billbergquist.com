import { Stack, Typography } from '@mui/material';
import { usePageTitle, useShowGenerations } from '../../hooks';
import Generations from './generations';
import Inputs from '../../components/inputs';
import { useContext } from 'react';
import { InputsContext } from '../../components/inputs-context';

export function NbaGenerator() {
  const {
    playerName,
    setPlayerName,
    injury,
    setInjury,
    mascot,
    setMascot,
    dayOfWeek,
    setDayOfWeek,
  } = useContext(InputsContext);
  const { showGenerations } = useShowGenerations(playerName);

  usePageTitle('Sports Shortcuts | NBA');

  return (
    <Stack spacing={1.5}>
      <Typography variant="h6">NBA Generator</Typography>
      <Stack spacing={3}>
        <Inputs
          playerName={playerName}
          setPlayerName={setPlayerName}
          injury={injury}
          setInjury={setInjury}
          dayOfWeek={dayOfWeek}
          setDayOfWeek={setDayOfWeek}
          mascot={mascot}
          setMascot={setMascot}
        />
        {showGenerations && (
          <Generations
            playerName={playerName}
            injury={injury}
            dayOfWeek={dayOfWeek}
            mascot={mascot}
          />
        )}
      </Stack>
    </Stack>
  );
}

export default NbaGenerator;
