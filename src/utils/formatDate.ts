import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export function formatDate(date: string | Date, format = 'DD/MM/YYYY [às] HH:mm') {
  return dayjs.utc(date).local().format(format)
}
