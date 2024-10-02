import { Link as MuiLink, Stack, Typography } from '@mui/material';
import { usePageTitle } from '../hooks';
import { Link } from 'react-router-dom';

export function Error() {
  usePageTitle('Sports Shortcuts | 404 Not Found');

  return (
    <Stack spacing={5} alignItems="center">
      <Typography variant="h4">404 Page Not Found</Typography>
      <MuiLink component={Link} to="/">
        Return to homepage
      </MuiLink>
    </Stack>
  );
}

export default Error;
