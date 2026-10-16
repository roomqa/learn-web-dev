export default function CalendarHeader({ monthLabel, onPrevMonth, onNextMonth }) {
  return (
    <div className="calendar-header">
      <h2 className="card-title">{monthLabel}</h2>
      <div className="calendar-nav">
        <button
          className="cal-arrow"
          type="button"
          aria-label="Предыдущий месяц"
          onClick={onPrevMonth}
        >
          ‹
        </button>
        <button
          className="cal-arrow"
          type="button"
          aria-label="Следующий месяц"
          onClick={onNextMonth}
        >
          ›
        </button>
      </div>
    </div>
  );
}
