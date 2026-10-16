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

// Актуальная дата «сегодня» на основе new Date()
const _now = new Date();
export const TODAY = {
  day: _now.getDate(),
  month: _now.getMonth(),
  year: _now.getFullYear(),
};

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

export function isDateSelectable(day, month, year, today = TODAY) {
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

export const SLOTS_BY_PATTERN = {
  default: [
    { time: "10:00", available: true },
    { time: "10:30", available: true },
    { time: "11:00", available: false },
    { time: "11:30", available: true },
    { time: "12:30", available: true },
    { time: "14:00", available: true },
    { time: "14:30", available: true },
    { time: "15:00", available: true },
    { time: "16:30", available: false },
    { time: "17:00", available: true },
  ],
  evenDay: [
    { time: "10:00", available: true },
    { time: "11:30", available: true },
    { time: "13:00", available: false },
    { time: "14:30", available: true },
    { time: "16:00", available: true },
    { time: "17:30", available: true },
    { time: "19:00", available: true },
  ],
  oddDay: [
    { time: "10:00", available: true },
    { time: "10:30", available: true },
    { time: "11:00", available: false },
    { time: "11:30", available: true },
    { time: "12:30", available: true },
    { time: "14:00", available: false },
    { time: "14:30", available: true },
    { time: "15:00", available: true },
    { time: "16:30", available: false },
    { time: "17:00", available: true },
  ],
};

export function getSlotsForDate(year, month, day) {
  if (!day) return [];
  if (day % 2 === 0) return SLOTS_BY_PATTERN.evenDay.slice();
  return SLOTS_BY_PATTERN.oddDay.slice();
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
