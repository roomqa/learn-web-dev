import React, { useState } from "react";
import {
  MONTHS_NOMINATIVE,
  MONTHS_GENITIVE,
  DAYS_OF_WEEK,
  TODAY,
  buildCalendarGrid,
  isDateSelectable,
  getSlotsForDate,
  formatSlotsCount,
  formatPrice,
} from "./data/date";

export default function App() {
  // Инициализируем текущий месяц и год по реальному «сегодня»
  const [currentYear, setCurrentYear] = useState(TODAY.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(TODAY.getMonth());

  // Выбранные дата и время по умолчанию (начинаем с сегодняшнего дня)
  const [selectedYear, setSelectedYear] = useState(TODAY.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(TODAY.getMonth());
  const [selectedDay, setSelectedDay] = useState(TODAY.getDate());
  const [selectedTime, setSelectedTime] = useState(null);

  const [slots, setSlots] = useState(() =>
    getSlotsForDate(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate())
  );

  const master = {
    name: "Анна Волкова",
    price: 2800,
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDayClick = (day) => {
    if (!day) return;
    
    // Дополнительная защита: запрещаем клик по прошедшим дням программно
    if (!isDateSelectable(day, currentMonth, currentYear, TODAY)) {
      return;
    }

    setSelectedYear(currentYear);
    setSelectedMonth(currentMonth);
    setSelectedDay(day);
    setSelectedTime(null); // Сброс времени при смене дня
    setSlots(getSlotsForDate(currentYear, currentMonth, day));
  };

  const handleSlotClick = (timeStr) => {
    setSelectedTime(timeStr);
  };

  const handleContinue = () => {
    if (!selectedDay || !selectedTime) return;
    const payload = {
      service: "Стрижка",
      duration: 60,
      master: master.name,
      price: master.price,
      date: { day: selectedDay, month: selectedMonth + 1, year: selectedYear },
      time: selectedTime,
    };
    localStorage.setItem("moss-booking", JSON.stringify(payload));
    alert(
      `Запись сохранена!\nДата: ${selectedDay} ${MONTHS_GENITIVE[selectedMonth]} ${selectedYear}\nВремя: ${selectedTime}`
    );
  };

  const weeks = buildCalendarGrid(currentYear, currentMonth);
  const monthLabel = `${MONTHS_NOMINATIVE[currentMonth]} ${currentYear}`;
  const selectedDateObj = new Date(selectedYear, selectedMonth, selectedDay);
  const dayOfWeekName = DAYS_OF_WEEK[selectedDateObj.getDay()];
  const monthGenitive = MONTHS_GENITIVE[selectedMonth];

  return (
    <div className="app-wrapper">
      <header className="site-header">
        <div className="header-top">
          <a href="#" className="brand-logo">
            <span className="brand-title">MOSS</span>
            <span className="brand-subtitle">BEAUTY ATELIER</span>
          </a>
          <nav className="main-nav">
            <a href="#" className="nav-link">Услуги</a>
            <a href="#" className="nav-link">Мастера</a>
            <a href="#" className="nav-link">Контакты</a>
          </nav>
          <button className="help-btn" type="button">Нужна помощь?</button>
        </div>

        <div className="progress-bar-container">
          <div className="progress-info">
            <span className="step-counter">ШАГ 4 ИЗ 6</span>
            <span className="step-name">Дата и время</span>
          </div>
          <div className="progress-segments">
            <div className="segment completed"></div>
            <div className="segment completed"></div>
            <div className="segment completed"></div>
            <div className="segment active"></div>
            <div className="segment"></div>
            <div className="segment"></div>
          </div>
        </div>
      </header>

      <main className="booking-main">
        <div className="booking-container">
          <div className="top-controls">
            <a href="#" className="back-link">‹ Назад</a>
            <div className="service-pill">Стрижка · 60 мин</div>
          </div>

          <section className="page-heading">
            <h1 className="main-title">Когда тебе удобно?</h1>
            <p className="main-subtitle">Выбери день в календаре и свободное время.</p>
          </section>

          <div className="booking-grid">
            {/* Календарь */}
            <section className="card calendar-card">
              <div className="calendar-header">
                <h2 className="card-title">{monthLabel}</h2>
                <div className="calendar-nav">
                  <button className="cal-arrow" type="button" onClick={handlePrevMonth}>‹</button>
                  <button className="cal-arrow" type="button" onClick={handleNextMonth}>›</button>
                </div>
              </div>

              <div className="weekdays-grid">
                <span>ПН</span><span>ВТ</span><span>СР</span><span>ЧТ</span><span>ПТ</span><span>СБ</span><span>ВС</span>
              </div>

              <div className="days-grid">
                {weeks.map((week, wIndex) =>
                  week.map((day, dIndex) => {
                    if (day === null) {
                      return <div key={`empty-${wIndex}-${dIndex}`} className="day-cell empty"></div>;
                    }
                    const selectable = isDateSelectable(day, currentMonth, currentYear, TODAY);
                    const isSelected =
                      selectedDay === day &&
                      selectedMonth === currentMonth &&
                      selectedYear === currentYear;

                    let className = "day-cell";
                    if (!selectable) className += " disabled";
                    else if (isSelected) className += " selected";
                    else className += " available";

                    return (
                      <button
                        key={`day-${day}`}
                        type="button"
                        className={className}
                        disabled={!selectable}
                        onClick={() => handleDayClick(day)}
                      >
                        {day}
                      </button>
                    );
                  })
                )}
              </div>

              <div className="calendar-legend">
                <div className="legend-item">
                  <span className="dot-free"></span>
                  <span>Свободно</span>
                </div>
                <div className="legend-item">
                  <span className="badge-selected">{selectedDay || "—"}</span>
                  <span>Выбранная дата</span>
                </div>
                <span className="legend-month">{monthLabel}</span>
              </div>
            </section>

            {/* Слоты времени */}
            <section className="card slots-card">
              <div className="slots-header">
                <div className="slots-title-group">
                  <h2 className="card-title">
                    {dayOfWeekName}, {selectedDay} {monthGenitive}
                  </h2>
                  <span className="slots-subtitle">Свободное время</span>
                </div>
                <div className="slots-count-badge">{formatSlotsCount(slots.length)}</div>
              </div>

              <div className="time-slots-grid">
                {slots.map((timeStr) => {
                  const isSelected = selectedTime === timeStr;
                  return (
                    <button
                      key={timeStr}
                      type="button"
                      className={`time-slot ${isSelected ? "selected" : ""}`}
                      onClick={() => handleSlotClick(timeStr)}
                    >
                      {timeStr}
                    </button>
                  );
                })}
              </div>

              <div className="selection-summary">
                <span className="summary-label">Выбрано</span>
                <strong className="summary-datetime">
                  {selectedDay} {monthGenitive} · {selectedTime || "выберите время"}
                </strong>
                <span className="summary-master">
                  {master.name} · {formatPrice(master.price)}
                </span>
              </div>
            </section>
          </div>

          <div className="booking-actions">
            <span className="timezone-note">
              {selectedTime
                ? `${dayOfWeekName}, ${selectedDay} ${monthGenitive} ${selectedYear} • ${selectedTime} (МСК)`
                : "Выберите удобный слот времени, чтобы продолжить"}
            </span>
            <button
              type="button"
              className="continue-btn"
              disabled={!selectedTime}
              onClick={handleContinue}
            >
              Продолжить →
            </button>
          </div>
        </div>
      </main>

      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-col brand-col">
              <span className="footer-logo">MOSS</span>
              <p className="footer-address">Москва, ул. Большая Никитская, 22</p>
              <a href="tel:+74951202418" className="footer-phone">+7 (495) 120-24-18</a>
            </div>
            <div className="footer-col">
              <span className="footer-heading">МЫ ОТКРЫТЫ</span>
              <p className="footer-text">Ежедневно · 10:00–21:00</p>
              <p className="footer-subtext">Запись по предварительной брони</p>
            </div>
            <div className="footer-col">
              <span className="footer-heading">НАПИШИ НАМ</span>
              <div className="social-links">
                <a href="#">Telegram</a><span>·</span><a href="#">WhatsApp</a>
              </div>
              <a href="mailto:hello@moss.studio" className="footer-email">hello@moss.studio</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">MOSS · beauty studio</span>
            <span className="footer-hours-mini">Ежедневно · 10:00–21:00</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
