import { FormControl, Grid2 as Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DayOfWeek } from '../types';

type InputsProps = {
	playerName: string;
	setPlayerName: (name: string) => void;
	injury: string;
	setInjury: (injury: string) => void;
	dayOfWeek: DayOfWeek;
	setDayOfWeek: (day: DayOfWeek) => void;
	mascot?: string;
	setMascot?: (mascot: string) => void;
};

export function Inputs({
												 playerName,
												 setPlayerName,
												 injury,
												 setInjury,
												 dayOfWeek,
												 setDayOfWeek,
												 mascot,
												 setMascot,
											 }: InputsProps) {
	const showMascot = Boolean(setMascot);
	const gridSize = showMascot ? 3 : 4;

	return (
		<Grid container spacing={2}>
			<Grid size={gridSize}>
				<FormControl fullWidth>
					<TextField label="Player name (required)" value={playerName} size="small" sx={{ backgroundColor: 'white' }}
										 onChange={(name) => setPlayerName(name.target.value)} />
				</FormControl>
			</Grid>
			<Grid size={gridSize}>
				<FormControl fullWidth>
					<TextField label="Injury" value={injury} size="small" sx={{ backgroundColor: 'white' }}
										 onChange={(injury) => setInjury(injury.target.value)} />
				</FormControl>
			</Grid>
			{showMascot && (
				<Grid size={gridSize}>
					<FormControl fullWidth>
						<TextField label="Mascot" value={mascot} size="small" sx={{ backgroundColor: 'white' }}
											 onChange={(mascot) => setMascot?.(mascot.target.value)} />
					</FormControl>
				</Grid>
			)}
			<Grid size={gridSize}>
				<FormControl fullWidth>
					<InputLabel id="day-of-week-label">Day of Week</InputLabel>
					<Select
						labelId="day-of-week-label"
						value={dayOfWeek}
						label="Day of week"
						size="small"
						onChange={(day) => setDayOfWeek(day.target.value as DayOfWeek)}
						sx={{ backgroundColor: 'white ' }}
					>

						<MenuItem value="Sunday">Sunday</MenuItem>
						<MenuItem value="Monday">Monday</MenuItem>
						<MenuItem value="Tuesday">Tuesday</MenuItem>
						<MenuItem value="Wednesday">Wednesday</MenuItem>
						<MenuItem value="Thursday">Thursday</MenuItem>
						<MenuItem value="Friday">Friday</MenuItem>
						<MenuItem value="Saturday">Saturday</MenuItem>
					</Select>
				</FormControl>
			</Grid>
		</Grid>
	);
}

export default Inputs;
