const MONTHS_NOMINATIVE = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

const MONTHS_GENITIVE = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

const DAYS_OF_WEEK = [
  "Воскресенье", "Понедельник", "Вторник",
  "Среда", "Четверг", "Пятница", "Суббота",
];

// Получаем реальное сегодняшнее устройство (без учета часов, минут и секунд)
const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

const SLOTS_BY_PATTERN = {
  default: ["10:00", "10:30", "11:00", "12:30", "14:00", "14:30", "15:00", "16:30", "17:00"],
  evenDay: ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00"],
  weekend: ["11:00", "12:00", "13:30", "15:00", "16:30", "18:00"],
};

const BOOKING_META = {
  serviceTitle: "Стрижка",
  duration: 60,
  masterName: "Анна Волкова",
  price: 2800,
};

// Состояние: при старте берем текущий месяц и год, а выбранный день — сегодня (или 17 октября для макета, если текущая дата совпадает)
const BOOKING_STATE = {
  currentYear: TODAY.getFullYear(),
  currentMonth: TODAY.getMonth(),
  selectedYear: TODAY.getFullYear(),
  selectedMonth: TODAY.getMonth(),
  selectedDay: TODAY.getDate(),
  selectedTime: null,
  slots: [],
};

function compareDates(date1, date2) {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());

  if (d1.getTime() < d2.getTime()) return -1;
  if (d1.getTime() > d2.getTime()) return 1;
  return 0;
}

/**
 * Проверка: нельзя выбирать дни раньше «сегодня».
 */
function isDateSelectable(day, month, year, today) {
  const targetDate = new Date(year, month, day);
  targetDate.setHours(0, 0, 0, 0);
  
  if (compareDates(targetDate, today) < 0) {
    return false; // День в прошлом — блокируем
  }
  return true;
}

function buildCalendarGrid(year, month) {
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

function getSlotsForDate(year, month, day) {
  const dayOfWeek = new Date(year, month, day).getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) return SLOTS_BY_PATTERN.weekend.slice();
  if (day % 2 === 0) return SLOTS_BY_PATTERN.evenDay.slice();
  return SLOTS_BY_PATTERN.default.slice();
}

function formatSlotsCount(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return `${count} слот`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${count} слота`;
  return `${count} слотов`;
}

function formatPrice(price) {
  return price.toLocaleString("ru-RU") + " ₽";
}

function renderCalendar() {
  const monthTitleEl = document.getElementById("calendarMonthTitle");
  const legendMonthEl = document.getElementById("legendMonthLabel");
  const legendSelectedDayEl = document.getElementById("legendSelectedDay");
  const daysGridEl = document.getElementById("calendarDaysGrid");

  const monthLabel = `${MONTHS_NOMINATIVE[BOOKING_STATE.currentMonth]} ${BOOKING_STATE.currentYear}`;
  monthTitleEl.textContent = monthLabel;
  legendMonthEl.textContent = monthLabel;
  legendSelectedDayEl.textContent = BOOKING_STATE.selectedDay || "—";

  const weeks = buildCalendarGrid(BOOKING_STATE.currentYear, BOOKING_STATE.currentMonth);
  let html = "";

  weeks.forEach(function (week) {
    week.forEach(function (day) {
      if (day === null) {
        html += '<div class="day-cell empty"></div>';
        return;
      }

      const selectable = isDateSelectable(
        day,
        BOOKING_STATE.currentMonth,
        BOOKING_STATE.currentYear,
        TODAY
      );

      const isSelected =
        BOOKING_STATE.selectedDay === day &&
        BOOKING_STATE.selectedMonth === BOOKING_STATE.currentMonth &&
        BOOKING_STATE.selectedYear === BOOKING_STATE.currentYear;

      if (!selectable) {
        html += `<button type="button" class="day-cell disabled" disabled data-day="${day}">${day}</button>`;
      } else if (isSelected) {
        html += `<button type="button" class="day-cell selected" data-day="${day}">${day}</button>`;
      } else {
        html += `<button type="button" class="day-cell available" data-day="${day}">${day}</button>`;
      }
    });
  });

  daysGridEl.innerHTML = html;

  const dayButtons = daysGridEl.querySelectorAll(".day-cell:not(.disabled):not(.empty)");
  dayButtons.forEach(function (btn) {
    btn.addEventListener("click", onDayClick);
  });
}

function renderTimeSlots() {
  const dateHeadingEl = document.getElementById("selectedDateHeading");
  const countBadgeEl = document.getElementById("slotsCountBadge");
  const slotsGridEl = document.getElementById("timeSlotsGrid");

  const selectedDateObj = new Date(
    BOOKING_STATE.selectedYear,
    BOOKING_STATE.selectedMonth,
    BOOKING_STATE.selectedDay
  );
  const dayOfWeekName = DAYS_OF_WEEK[selectedDateObj.getDay()];
  const monthGenitive = MONTHS_GENITIVE[BOOKING_STATE.selectedMonth];

  dateHeadingEl.textContent = `${dayOfWeekName}, ${BOOKING_STATE.selectedDay} ${monthGenitive}`;
  countBadgeEl.textContent = formatSlotsCount(BOOKING_STATE.slots.length);

  let html = "";
  BOOKING_STATE.slots.forEach(function (timeStr) {
    const activeClass = BOOKING_STATE.selectedTime === timeStr ? "selected" : "";
    html += `<button type="button" class="time-slot ${activeClass}" data-time="${timeStr}">${timeStr}</button>`;
  });

  slotsGridEl.innerHTML = html;

  const slotButtons = slotsGridEl.querySelectorAll(".time-slot");
  slotButtons.forEach(function (btn) {
    btn.addEventListener("click", onTimeSlotClick);
  });
}

function updateBottomBar() {
  const summaryDateTimeEl = document.getElementById("summaryDateTime");
  const summaryMasterEl = document.getElementById("summaryMaster");
  const bottomBarNoteEl = document.getElementById("bottomBarNote");
  const continueBtn = document.getElementById("continueBtn");

  const selectedDateObj = new Date(
    BOOKING_STATE.selectedYear,
    BOOKING_STATE.selectedMonth,
    BOOKING_STATE.selectedDay
  );
  const dayOfWeekName = DAYS_OF_WEEK[selectedDateObj.getDay()];
  const monthGenitive = MONTHS_GENITIVE[BOOKING_STATE.selectedMonth];

  summaryMasterEl.textContent = `${BOOKING_META.masterName} · ${formatPrice(BOOKING_META.price)}`;

  if (BOOKING_STATE.selectedTime) {
    summaryDateTimeEl.textContent = `${BOOKING_STATE.selectedDay} ${monthGenitive} · ${BOOKING_STATE.selectedTime}`;
    bottomBarNoteEl.textContent = `${dayOfWeekName}, ${BOOKING_STATE.selectedDay} ${monthGenitive} ${BOOKING_STATE.selectedYear} • ${BOOKING_STATE.selectedTime} (МСК)`;
    continueBtn.disabled = false;
  } else {
    summaryDateTimeEl.textContent = `${BOOKING_STATE.selectedDay} ${monthGenitive} · выберите время`;
    bottomBarNoteEl.textContent = "Выберите удобный слот времени, чтобы продолжить";
    continueBtn.disabled = true;
  }
}

function onDayClick(event) {
  const day = parseInt(event.currentTarget.dataset.day, 10);

  if (
    BOOKING_STATE.selectedDay === day &&
    BOOKING_STATE.selectedMonth === BOOKING_STATE.currentMonth &&
    BOOKING_STATE.selectedYear === BOOKING_STATE.currentYear
  ) {
    return;
  }

  BOOKING_STATE.selectedDay = day;
  BOOKING_STATE.selectedMonth = BOOKING_STATE.currentMonth;
  BOOKING_STATE.selectedYear = BOOKING_STATE.currentYear;
  BOOKING_STATE.selectedTime = null; // Обязательный сброс времени при смене дня

  BOOKING_STATE.slots = getSlotsForDate(
    BOOKING_STATE.selectedYear,
    BOOKING_STATE.selectedMonth,
    BOOKING_STATE.selectedDay
  );

  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

function onTimeSlotClick(event) {
  BOOKING_STATE.selectedTime = event.currentTarget.dataset.time;
  renderTimeSlots();
  updateBottomBar();
}

function setupMonthNavigation() {
  const prevBtn = document.getElementById("prevMonthBtn");
  const nextBtn = document.getElementById("nextMonthBtn");
  const continueBtn = document.getElementById("continueBtn");

  prevBtn.addEventListener("click", function () {
    BOOKING_STATE.currentMonth -= 1;
    if (BOOKING_STATE.currentMonth < 0) {
      BOOKING_STATE.currentMonth = 11;
      BOOKING_STATE.currentYear -= 1;
    }
    renderCalendar();
  });

  nextBtn.addEventListener("click", function () {
    BOOKING_STATE.currentMonth += 1;
    if (BOOKING_STATE.currentMonth > 11) {
      BOOKING_STATE.currentMonth = 0;
      BOOKING_STATE.currentYear += 1;
    }
    renderCalendar();
  });

  continueBtn.addEventListener("click", function () {
    if (!BOOKING_STATE.selectedDay || !BOOKING_STATE.selectedTime) return;

    const bookingPayload = {
      service: BOOKING_META.serviceTitle,
      duration: BOOKING_META.duration,
      master: BOOKING_META.masterName,
      price: BOOKING_META.price,
      date: {
        day: BOOKING_STATE.selectedDay,
        month: BOOKING_STATE.selectedMonth + 1,
        year: BOOKING_STATE.selectedYear,
      },
      time: BOOKING_STATE.selectedTime,
    };

    localStorage.setItem("moss-booking", JSON.stringify(bookingPayload));
    alert(
      `Запись сохранена!\nДата: ${BOOKING_STATE.selectedDay} ${MONTHS_GENITIVE[BOOKING_STATE.selectedMonth]} ${BOOKING_STATE.selectedYear}\nВремя: ${BOOKING_STATE.selectedTime}\nМастер: ${BOOKING_META.masterName}`
    );
  });
}

function init() {
  // Проверяем, доступен ли выбранный день (сегодня), если нет — сбрасываем на сегодня
  if (!isDateSelectable(BOOKING_STATE.selectedDay, BOOKING_STATE.selectedMonth, BOOKING_STATE.selectedYear, TODAY)) {
    BOOKING_STATE.selectedDay = TODAY.getDate();
    BOOKING_STATE.selectedMonth = TODAY.getMonth();
    BOOKING_STATE.selectedYear = TODAY.getFullYear();
  }

  BOOKING_STATE.slots = getSlotsForDate(
    BOOKING_STATE.selectedYear,
    BOOKING_STATE.selectedMonth,
    BOOKING_STATE.selectedDay
  );

  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
  setupMonthNavigation();
}

document.addEventListener("DOMContentLoaded", init);
