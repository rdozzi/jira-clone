import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export function getLocalTime(newDate: Date | string) {
  const utcTime = dayjs.utc(newDate);
  const localTime = utcTime.tz(dayjs.tz.guess());

  return localTime.format('YYYY-MM-DD HH:mm:ss');
}
