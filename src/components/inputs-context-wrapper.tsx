import { InputsContext } from './inputs-context';
import { ReactNode, useState } from 'react';
import { DayOfWeek } from '../types';
import { getCurrentDay } from '../utils/date';

type InputsContextWrapperProps = {
  children: ReactNode;
};

export function InputsContextWrapper({ children }: InputsContextWrapperProps) {
  const [playerName, setPlayerName] = useState('');
  const [injury, setInjury] = useState<string>('');
  const [mascot, setMascot] = useState<string>('');
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(getCurrentDay());

  return (
    <InputsContext.Provider
      value={{
        playerName,
        setPlayerName,
        injury,
        setInjury,
        mascot,
        setMascot,
        dayOfWeek,
        setDayOfWeek,
      }}
    >
      {children}
    </InputsContext.Provider>
  );
}
