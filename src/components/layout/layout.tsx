import { Box, Container } from '@mui/material';
import Header from './header';
import Footer from './footer';
import { InputsContextWrapper } from '../inputs-context-wrapper';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <InputsContextWrapper>
        <Container sx={{ py: 3, flex: 1 }}>{children}</Container>
      </InputsContextWrapper>
      <Footer />
    </Box>
  );
}
