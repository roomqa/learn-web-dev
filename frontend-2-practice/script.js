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

// Актуальная дата «сегодня» на основе new Date()
const _now = new Date();
const TODAY = {
  day: _now.getDate(),
  month: _now.getMonth(),
  year: _now.getFullYear(),
};

const SLOTS_BY_PATTERN = {
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

const BOOKING_META = {
  serviceTitle: "Стрижка",
  duration: 60,
  masterName: "Анна Волкова",
  price: 2800,
};

// Состояние приложения
const BOOKING_STATE = {
  currentYear: TODAY.year,
  currentMonth: TODAY.month,
  selectedYear: TODAY.year,
  selectedMonth: TODAY.month,
  selectedDay: TODAY.day,
  selectedTime: null,
  slots: [],
};

/**
 * Сравнение двух дат ({ day, month, year } или Date).
 */
function compareDates(date1, date2) {
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

/**
 * Проверка: нельзя выбирать дни раньше «сегодня».
 */
function isDateSelectable(day, month, year, today = TODAY) {
  return compareDates({ day, month, year }, today) >= 0;
}

/**
 * Построение сетки календаря для указанного месяца.
 */
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
  if (!day) return [];
  if (day % 2 === 0) return SLOTS_BY_PATTERN.evenDay.slice();
  return SLOTS_BY_PATTERN.oddDay.slice();
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

  const isSelectedInCurrentMonth =
    BOOKING_STATE.selectedMonth === BOOKING_STATE.currentMonth &&
    BOOKING_STATE.selectedYear === BOOKING_STATE.currentYear;

  legendSelectedDayEl.textContent =
    isSelectedInCurrentMonth && BOOKING_STATE.selectedDay
      ? BOOKING_STATE.selectedDay
      : "—";

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

  if (!BOOKING_STATE.selectedDay) {
    dateHeadingEl.textContent = `${MONTHS_NOMINATIVE[BOOKING_STATE.currentMonth]} ${BOOKING_STATE.currentYear}`;
    countBadgeEl.textContent = "0 слотов";
    slotsGridEl.innerHTML =
      '<div style="grid-column: 1 / -1; text-align: center; color: #787d78; padding: 24px;">Нет доступных слотов на выбранный месяц</div>';
    return;
  }

  const selectedDateObj = new Date(
    BOOKING_STATE.selectedYear,
    BOOKING_STATE.selectedMonth,
    BOOKING_STATE.selectedDay
  );
  const dayOfWeekName = DAYS_OF_WEEK[selectedDateObj.getDay()];
  const monthGenitive = MONTHS_GENITIVE[BOOKING_STATE.selectedMonth];

  dateHeadingEl.textContent = `${dayOfWeekName}, ${BOOKING_STATE.selectedDay} ${monthGenitive}`;

  // Подсчитываем только действительно свободные слоты (available: true)
  const availableSlotsCount = BOOKING_STATE.slots.filter(function (slot) {
    return typeof slot === "string" ? true : slot.available;
  }).length;
  countBadgeEl.textContent = formatSlotsCount(availableSlotsCount);

  let html = "";
  BOOKING_STATE.slots.forEach(function (slot) {
    const timeStr = typeof slot === "string" ? slot : slot.time;
    const isAvailable = typeof slot === "string" ? true : slot.available;
    const isSelected = BOOKING_STATE.selectedTime === timeStr;

    if (!isAvailable) {
      html += `<button type="button" class="time-slot booked" disabled data-time="${timeStr}">${timeStr}</button>`;
    } else {
      const activeClass = isSelected ? "selected" : "";
      html += `<button type="button" class="time-slot ${activeClass}" data-time="${timeStr}">${timeStr}</button>`;
    }
  });

  slotsGridEl.innerHTML = html;

  const slotButtons = slotsGridEl.querySelectorAll(".time-slot:not(.booked):not(:disabled)");
  slotButtons.forEach(function (btn) {
    btn.addEventListener("click", onTimeSlotClick);
  });
}

function updateBottomBar() {
  const summaryDateTimeEl = document.getElementById("summaryDateTime");
  const summaryMasterEl = document.getElementById("summaryMaster");
  const bottomBarNoteEl = document.getElementById("bottomBarNote");
  const continueBtn = document.getElementById("continueBtn");

  summaryMasterEl.textContent = `${BOOKING_META.masterName} · ${formatPrice(BOOKING_META.price)}`;

  if (!BOOKING_STATE.selectedDay) {
    summaryDateTimeEl.textContent = "дата не выбрана";
    bottomBarNoteEl.textContent = "Выберите доступную дату в календаре";
    continueBtn.disabled = true;
    return;
  }

  const selectedDateObj = new Date(
    BOOKING_STATE.selectedYear,
    BOOKING_STATE.selectedMonth,
    BOOKING_STATE.selectedDay
  );
  const dayOfWeekName = DAYS_OF_WEEK[selectedDateObj.getDay()];
  const monthGenitive = MONTHS_GENITIVE[BOOKING_STATE.selectedMonth];

  const timePart = BOOKING_STATE.selectedTime || "время не выбрано";
  bottomBarNoteEl.textContent = `${dayOfWeekName}, ${BOOKING_STATE.selectedDay} ${monthGenitive} ${BOOKING_STATE.selectedYear} • ${timePart}`;

  if (BOOKING_STATE.selectedTime) {
    summaryDateTimeEl.textContent = `${BOOKING_STATE.selectedDay} ${monthGenitive} · ${BOOKING_STATE.selectedTime}`;
    continueBtn.disabled = false;
  } else {
    summaryDateTimeEl.textContent = `${BOOKING_STATE.selectedDay} ${monthGenitive} · выберите время`;
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

  function changeMonth(delta) {
    BOOKING_STATE.currentMonth += delta;
    if (BOOKING_STATE.currentMonth < 0) {
      BOOKING_STATE.currentMonth = 11;
      BOOKING_STATE.currentYear -= 1;
    } else if (BOOKING_STATE.currentMonth > 11) {
      BOOKING_STATE.currentMonth = 0;
      BOOKING_STATE.currentYear += 1;
    }

    // Синхронизируем выбранную дату с новым отображаемым месяцем
    BOOKING_STATE.selectedMonth = BOOKING_STATE.currentMonth;
    BOOKING_STATE.selectedYear = BOOKING_STATE.currentYear;
    BOOKING_STATE.selectedTime = null; // Сброс времени при переходе к другому месяцу

    const isCurrentMonth =
      BOOKING_STATE.currentYear === TODAY.year &&
      BOOKING_STATE.currentMonth === TODAY.month;
    const isFutureMonth =
      compareDates(
        { day: 1, month: BOOKING_STATE.currentMonth, year: BOOKING_STATE.currentYear },
        TODAY
      ) > 0;

    if (isCurrentMonth) {
      BOOKING_STATE.selectedDay = TODAY.day;
    } else if (isFutureMonth) {
      BOOKING_STATE.selectedDay = 1;
    } else {
      BOOKING_STATE.selectedDay = null;
    }

    if (BOOKING_STATE.selectedDay !== null) {
      BOOKING_STATE.slots = getSlotsForDate(
        BOOKING_STATE.selectedYear,
        BOOKING_STATE.selectedMonth,
        BOOKING_STATE.selectedDay
      );
    } else {
      BOOKING_STATE.slots = [];
    }

    renderCalendar();
    renderTimeSlots();
    updateBottomBar();
  }

  prevBtn.addEventListener("click", function () {
    changeMonth(-1);
  });

  nextBtn.addEventListener("click", function () {
    changeMonth(1);
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
  if (!isDateSelectable(BOOKING_STATE.selectedDay, BOOKING_STATE.selectedMonth, BOOKING_STATE.selectedYear, TODAY)) {
    BOOKING_STATE.selectedDay = TODAY.day;
    BOOKING_STATE.selectedMonth = TODAY.month;
    BOOKING_STATE.selectedYear = TODAY.year;
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
