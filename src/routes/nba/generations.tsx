import { DayOfWeek } from '../../types';
import { Box, Stack } from '@mui/material';
import StatusUpdate from '../../components/statusUpdate';
import { makePossessive } from '../../utils/text';

type GenerationsProps = {
  playerName: string;
  injury: string;
  dayOfWeek: DayOfWeek;
  mascot: string;
};

export function Generations({ playerName, injury, dayOfWeek, mascot }: GenerationsProps) {
  return (
    <Box>
      <Stack spacing={1}>
        <StatusUpdate
          playerName={playerName}
          injury={injury}
          dayOfWeek={dayOfWeek}
          middleSlug="headed to locker room"
        />
        <StatusUpdate
          playerName={playerName}
          injury={injury}
          dayOfWeek={dayOfWeek}
          middleSlug="headed to locker room again"
        />
        <StatusUpdate
          playerName={playerName}
          injury={injury}
          dayOfWeek={dayOfWeek}
          middleSlug="helped to locker room"
        />
        <StatusUpdate
          playerName={playerName}
          injury={injury}
          dayOfWeek={dayOfWeek}
          middleSlug="carted to locker room"
        />
        <StatusUpdate
          playerName={playerName}
          injury={injury}
          dayOfWeek={dayOfWeek}
          middleSlug="stretchered to locker room"
        />
        <StatusUpdate
          playerName={playerName}
          injury={injury}
          dayOfWeek={dayOfWeek}
          middleSlug="in locker room"
        />
        <StatusUpdate
          playerName={playerName}
          injury={injury}
          dayOfWeek={dayOfWeek}
          middleSlug="has returned to"
          endSlug="'s game"
        />
        <StatusUpdate
          playerName={playerName}
          injury={injury}
          dayOfWeek={dayOfWeek}
          middleSlug={`has returned to${mascot ? ` ${makePossessive(mascot)}` : ''} bench`}
        />
        <StatusUpdate
          playerName={playerName}
          injury={injury}
          dayOfWeek={dayOfWeek}
          middleSlug="available to return"
        />
        <StatusUpdate
          playerName={playerName}
          injury={injury}
          dayOfWeek={dayOfWeek}
          middleSlug="probable to return"
        />
        <StatusUpdate
          playerName={playerName}
          injury={injury}
          dayOfWeek={dayOfWeek}
          middleSlug="will return"
        />
        <StatusUpdate
          playerName={playerName}
          injury={injury}
          dayOfWeek={dayOfWeek}
          middleSlug="expected to return"
        />
        <StatusUpdate
          playerName={playerName}
          injury={injury}
          dayOfWeek={dayOfWeek}
          middleSlug="questionable to return"
        />
        <StatusUpdate
          playerName={playerName}
          injury={injury}
          dayOfWeek={dayOfWeek}
          middleSlug="doubtful to return"
        />
        <StatusUpdate
          playerName={playerName}
          injury={injury}
          dayOfWeek={dayOfWeek}
          middleSlug="won't return"
        />
        <StatusUpdate
          playerName={playerName}
          injury={injury}
          dayOfWeek={dayOfWeek}
          middleSlug="will start second half"
        />
        <StatusUpdate
          playerName={playerName}
          injury={injury}
          dayOfWeek={dayOfWeek}
          middleSlug="remains in locker room to start second half"
        />
        <StatusUpdate
          playerName={playerName}
          middleSlug="has been ejected"
          dayOfWeek={dayOfWeek}
          endSlug=" after being assessed a Flagrant 2 foul"
        />
        <StatusUpdate
          playerName={playerName}
          middleSlug="has been ejected"
          dayOfWeek={dayOfWeek}
          endSlug=" after being assessed two Flagrant 1 fouls"
        />
        <StatusUpdate
          playerName={playerName}
          middleSlug="has been ejected"
          dayOfWeek={dayOfWeek}
          endSlug=" after being assessed two technical fouls"
        />
        <StatusUpdate playerName={playerName} middleSlug="has been ejected" dayOfWeek={dayOfWeek} />
      </Stack>
    </Box>
  );
}

export default Generations;
