import { Stack, Typography } from '@mui/material';
import { useInputs, usePageTitle } from '../../hooks';
import Generations from './generations';
import Inputs from '../../components/inputs';

export function NbaGenerator() {
	const {
		playerName, setPlayerName, injury, setInjury, mascot, setMascot, dayOfWeek, setDayOfWeek, showGenerations,
	} = useInputs();

	usePageTitle('Sports Shortcuts | NBA');

	return (
		<Stack spacing={1.5}>
			<Typography variant="h6">NBA Generator</Typography>
			<Stack spacing={3}>
				<Inputs playerName={playerName} setPlayerName={setPlayerName} injury={injury} setInjury={setInjury}
								dayOfWeek={dayOfWeek} setDayOfWeek={setDayOfWeek} mascot={mascot} setMascot={setMascot} />
				{showGenerations ? (
					<Generations playerName={playerName} injury={injury} dayOfWeek={dayOfWeek} mascot={mascot} />
				) : (
					<Typography align="center" variant="subtitle2">Enter a player name to see the generations.</Typography>
				)}
			</Stack>
		</Stack>
	);
}

export default NbaGenerator;
