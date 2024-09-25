import { Typography } from '@mui/material';
import { usePageTitle } from '../hooks';

export function Home() {
	usePageTitle('Sports Shortcuts');

	return (
		<Typography variant="body2">Use the links above to find what you are looking for.</Typography>
	);
}

export default Home;
