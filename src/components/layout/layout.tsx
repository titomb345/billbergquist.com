import { Box, Container } from '@mui/material';
import Header from './header';
import Footer from './footer';

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<Box display="flex" flexDirection="column" minHeight="100vh">
			<Header />
			<Container sx={{ py: 3, flex: 1 }}>
				{children}
			</Container>
			<Footer />
		</Box>
	);
}
