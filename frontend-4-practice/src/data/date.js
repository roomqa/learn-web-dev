// Чистые функции для работы с датами и форматированием

export const MONTHS_NOMINATIVE = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

export const MONTHS_GENITIVE = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

export const DAYS_OF_WEEK = [
  "Воскресенье", "Понедельник", "Вторник",
  "Среда", "Четверг", "Пятница", "Суббота",
];

export function compareDates(date1, date2) {
  const d1 = date1 instanceof Date
    ? new Date(date1.getFullYear(), date1.getMonth(), date1.getDate())
    : new Date(date1.year, date1.month, date1.day);
  const d2 = date2 instanceof Date
    ? new Date(date2.getFullYear(), date2.getMonth(), date2.getDate())
    : new Date(date2.year, date2.month, date2.day);

  if (d1.getTime() < d2.getTime()) return -1;
  if (d1.getTime() > d2.getTime()) return 1;
  return 0;
}

export function isDateSelectable(day, month, year, today) {
  if (!today) return true;
  return compareDates({ day, month, year }, today) >= 0;
}

export function buildCalendarGrid(year, month) {
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDayOfMonth.getDay() + 6) % 7;

  const weeks = [];
  let currentWeek = [];

  for (let i = 0; i < startOffset; i++) {
    currentWeek.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
}

export function formatSlotsCount(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return `${count} слот`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${count} слота`;
  return `${count} слотов`;
}

export function formatPrice(price) {
  return price.toLocaleString("ru-RU") + " ₽";
}

export function formatDateTime(date, time) {
  const monthName = MONTHS_GENITIVE[date.month];
  return `${date.day} ${monthName} ${date.year} в ${time}`;
}

export function formatDateTimeShort(date, time) {
  const monthName = MONTHS_GENITIVE[date.month];
  return `${date.day} ${monthName} ${date.year}, ${time}`;
}
