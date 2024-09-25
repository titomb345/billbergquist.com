import { DayOfWeek } from '../types';

export function getCurrentDay(): DayOfWeek {
	const day = new Date().getDay();
	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as DayOfWeek[];
	return days[day];
}
