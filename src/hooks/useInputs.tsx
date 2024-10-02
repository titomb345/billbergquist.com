import { useEffect, useState } from 'react';
import { DayOfWeek } from '../types';
import { getCurrentDay } from '../utils/date';

export function useInputs() {
  const [playerName, setPlayerName] = useState<string>('');
  const [injury, setInjury] = useState<string>('');
  const [mascot, setMascot] = useState<string>('');
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(getCurrentDay());
  const [showGenerations, setShowGenerations] = useState<boolean>(false);

  useEffect(() => {
    if (playerName) {
      setShowGenerations(true);
    } else {
      setShowGenerations(false);
    }
  }, [playerName]);

  return {
    playerName,
    setPlayerName,
    injury,
    setInjury,
    mascot,
    setMascot,
    dayOfWeek,
    setDayOfWeek,
    showGenerations,
  };
}
