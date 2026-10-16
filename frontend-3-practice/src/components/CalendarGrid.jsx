import { buildCalendarGrid, isDateSelectable } from "../data/date";

export default function CalendarGrid({
  currentYear,
  currentMonth,
  selectedDay,
  selectedMonth,
  selectedYear,
  today,
  monthLabel,
  onSelectDay,
}) {
  const weeks = buildCalendarGrid(currentYear, currentMonth);

  return (
    <>
      <div className="weekdays-grid">
        <span>ПН</span>
        <span>ВТ</span>
        <span>СР</span>
        <span>ЧТ</span>
        <span>ПТ</span>
        <span>СБ</span>
        <span>ВС</span>
      </div>

      <div className="days-grid">
        {weeks.map((week, wIndex) =>
          week.map((day, dIndex) => {
            if (day === null) {
              return (
                <div
                  key={`empty-${wIndex}-${dIndex}`}
                  className="day-cell empty"
                ></div>
              );
            }

            const selectable = isDateSelectable(day, currentMonth, currentYear, today);
            const isSelected =
              selectedDay === day &&
              selectedMonth === currentMonth &&
              selectedYear === currentYear;

            let className = "day-cell";
            if (!selectable) {
              className += " disabled";
            } else if (isSelected) {
              className += " selected";
            } else {
              className += " available";
            }

            return (
              <button
                key={`day-${day}`}
                type="button"
                className={className}
                disabled={!selectable}
                onClick={() => selectable && onSelectDay(day)}
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
          <span className="badge-selected">
            {selectedMonth === currentMonth && selectedYear === currentYear
              ? selectedDay
              : "—"}
          </span>
          <span>Выбранная дата</span>
        </div>
        <span className="legend-month">{monthLabel}</span>
      </div>
    </>
  );
}
