import { useEffect, useState } from 'react';

export function useShowGenerations(playerName: string) {
  const [showGenerations, setShowGenerations] = useState<boolean>(false);

  useEffect(() => {
    if (playerName) {
      setShowGenerations(true);
    } else {
      setShowGenerations(false);
    }
  }, [playerName]);

  return {
    showGenerations,
  };
}
