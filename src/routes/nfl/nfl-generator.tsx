import { Stack, Typography } from '@mui/material';
import { useInputs, usePageTitle } from '../../hooks';
import Generations from './generations';
import Inputs from '../../components/inputs';

export function NflGenerator() {
  const { playerName, setPlayerName, injury, setInjury, dayOfWeek, setDayOfWeek, showGenerations } =
    useInputs();

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
        {showGenerations ? (
          <Generations playerName={playerName} injury={injury} dayOfWeek={dayOfWeek} />
        ) : (
          <Typography align="center" variant="subtitle2">
            Enter a player name to see the generations.
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}

export default NflGenerator;
