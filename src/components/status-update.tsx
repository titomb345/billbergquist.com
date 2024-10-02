import { DayOfWeek } from '../types';
import { Card, IconButton, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const COPIED_FADE = 3000;

type TweetProps = {
  playerName: string;
  injury?: string;
  dayOfWeek: DayOfWeek;
  middleSlug: string;
  endSlug?: string;
};

export function StatusUpdate({
  playerName,
  injury,
  dayOfWeek,
  middleSlug,
  endSlug = '',
}: TweetProps) {
  const [showCopy, setShowCopy] = useState<boolean>(true);

  const text = useMemo(() => {
    let text = `Status alert: ${playerName.trim()}`;

    if (injury) {
      text += ` (${injury.trim()})`;
    }

    text += ` ${middleSlug} ${dayOfWeek}${endSlug}.`;

    return text;
  }, [playerName, injury, middleSlug, dayOfWeek, endSlug]);

  const handleCopy = async () => {
    setShowCopy(false);

    setTimeout(() => {
      setShowCopy(true);
    }, COPIED_FADE);
  };

  return (
    <Card variant="outlined">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        minHeight={30}
        py={1}
        px={2}
        spacing={2}
      >
        <Typography>{text}</Typography>
        {showCopy ? (
          <CopyToClipboard text={text} onCopy={handleCopy}>
            <IconButton size="small">
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </CopyToClipboard>
        ) : (
          <Typography variant="subtitle2">Copied!</Typography>
        )}
      </Stack>
    </Card>
  );
}

export default StatusUpdate;
