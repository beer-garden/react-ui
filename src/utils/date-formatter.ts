import { DateTimeFormatOptions } from 'luxon'

export const dateFormatted = (date: Date) => {
  const options: DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    second: 'numeric',
    minute: 'numeric',
    hour12: false,
  }
  return date.toLocaleString(undefined, options)
}
