import { createContext } from 'react';
import { DayOfWeek } from '../types';

type InputContextType = {
  playerName: string;
  setPlayerName: (name: string) => void;
  injury: string;
  setInjury: (injury: string) => void;
  mascot: string;
  setMascot: (mascot: string) => void;
  dayOfWeek: DayOfWeek;
  setDayOfWeek: (dayOfWeek: DayOfWeek) => void;
};

export const InputsContext = createContext<InputContextType>({
  playerName: '',
  setPlayerName: (_name) => {},
  injury: '',
  setInjury: (_injury) => {},
  mascot: '',
  setMascot: (_mascot) => {},
  dayOfWeek: 'Sunday',
  setDayOfWeek: (_dayOfWeek) => {},
});
