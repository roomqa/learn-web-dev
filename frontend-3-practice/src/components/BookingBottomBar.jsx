export default function BookingBottomBar({
  dayOfWeekName,
  selectedDay,
  monthGenitive,
  selectedYear,
  selectedTime,
  onContinue,
}) {
  const noteText = selectedDay
    ? `${dayOfWeekName}, ${selectedDay} ${monthGenitive} ${selectedYear} • ${selectedTime || "время не выбрано"}`
    : "Выберите доступную дату в календаре";

  return (
    <div className="booking-actions">
      <span className="timezone-note">{noteText}</span>
      <button
        type="button"
        className="continue-btn"
        disabled={!selectedTime}
        onClick={onContinue}
      >
        Продолжить →
      </button>
    </div>
  );
}
