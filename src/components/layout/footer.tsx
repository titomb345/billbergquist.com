import { Container, Divider, Toolbar, Typography } from '@mui/material';

export function Footer() {
	return (
		<Container maxWidth="xl">
			<Divider />
			<Toolbar disableGutters variant="dense">
				<Typography variant="caption">&copy;{new Date().getFullYear()} Bill
					Bergquist</Typography>
			</Toolbar>
		</Container>
	);
}

export default Footer;
