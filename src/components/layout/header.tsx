import { AppBar, Box, Button, Container, Link as MuiLink, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';

const pages = ['NFL', 'NBA'];

export function Header() {
	return (
		<AppBar position="sticky">
			<Container>
				<Toolbar disableGutters variant="dense">
					<Box sx={{ flexGrow: 1, display: 'flex' }}>
						{pages.map((page) => (
							<MuiLink component={Link} to={`/${page}`} key={page}>
								<Button
									size="small"
									key={page}
									sx={{ color: 'white' }}
								>
									{page}
								</Button>
							</MuiLink>
						))}
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
}

export default Header;
