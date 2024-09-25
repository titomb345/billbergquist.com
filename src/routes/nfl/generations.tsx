import { DayOfWeek } from '../../types';
import { Box, Stack } from '@mui/material';
import StatusUpdate from '../../components/statusUpdate';

type GenerationsProps = {
	playerName: string;
	injury: string;
	dayOfWeek: DayOfWeek;
};

export function Generations({ playerName, injury, dayOfWeek }: GenerationsProps) {
	return (
		<Box>
			<Stack spacing={1}>
				<StatusUpdate playerName={playerName} injury={injury} dayOfWeek={dayOfWeek}
											middleSlug="headed to locker room" />
				<StatusUpdate playerName={playerName} injury={injury} dayOfWeek={dayOfWeek}
											middleSlug="headed to medical tent" />
				<StatusUpdate playerName={playerName} injury={injury} dayOfWeek={dayOfWeek}
											middleSlug="carted to locker room" />
				<StatusUpdate playerName={playerName} injury={injury} dayOfWeek={dayOfWeek}
											middleSlug="questionable to return" />
				<StatusUpdate playerName={playerName} injury={injury} dayOfWeek={dayOfWeek}
											middleSlug="remains in locker room" />
				<StatusUpdate playerName={playerName} injury={injury} dayOfWeek={dayOfWeek} middleSlug="won't return" />
				<StatusUpdate playerName={playerName} injury={injury} dayOfWeek={dayOfWeek} middleSlug="will return" />
				<StatusUpdate playerName={playerName} injury={injury} dayOfWeek={dayOfWeek} middleSlug="has returned to"
											endSlug="'s game" />
				<StatusUpdate playerName={playerName} injury={injury} dayOfWeek={dayOfWeek} middleSlug="unlikely to return" />
				<StatusUpdate playerName={playerName} dayOfWeek={dayOfWeek} middleSlug="being evaluated for concussion" />
			</Stack>
		</Box>
	);
}

export default Generations;
