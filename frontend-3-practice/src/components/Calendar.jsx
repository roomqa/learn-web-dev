import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import { MONTHS_NOMINATIVE } from "../data/date";

export default function Calendar({
  currentYear,
  currentMonth,
  selectedDay,
  selectedMonth,
  selectedYear,
  today,
  onPrevMonth,
  onNextMonth,
  onSelectDay,
}) {
  const monthLabel = `${MONTHS_NOMINATIVE[currentMonth]} ${currentYear}`;

  return (
    <section className="card calendar-card">
      <CalendarHeader
        monthLabel={monthLabel}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
      />
      <CalendarGrid
        currentYear={currentYear}
        currentMonth={currentMonth}
        selectedDay={selectedDay}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        today={today}
        monthLabel={monthLabel}
        onSelectDay={onSelectDay}
      />
    </section>
  );
}
