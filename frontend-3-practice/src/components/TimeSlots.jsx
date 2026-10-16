import { formatSlotsCount, formatPrice } from "../data/date";

export default function TimeSlots({
  selectedDay,
  monthGenitive,
  dayOfWeekName,
  slots,
  selectedTime,
  master,
  onSelectTime,
}) {
  if (!selectedDay) {
    return (
      <section className="card slots-card">
        <div className="slots-header">
          <div className="slots-title-group">
            <h2 className="card-title">Дата не выбрана</h2>
            <span className="slots-subtitle">Свободное время</span>
          </div>
          <div className="slots-count-badge">0 слотов</div>
        </div>

        <div style={{ padding: "48px 16px", textAlign: "center", color: "#787d78" }}>
          Нет доступных слотов на выбранный месяц
        </div>

        <div className="selection-summary">
          <span className="summary-label">Выбрано</span>
          <strong className="summary-datetime">дата не выбрана</strong>
          <span className="summary-master">
            {master.name} · {formatPrice(master.price)}
          </span>
        </div>
      </section>
    );
  }

  // Считаем только доступные слоты (available: true)
  const availableSlotsCount = slots.filter(
    (slot) => (typeof slot === "string" ? true : slot.available)
  ).length;

  return (
    <section className="card slots-card">
      <div className="slots-header">
        <div className="slots-title-group">
          <h2 className="card-title">
            {dayOfWeekName}, {selectedDay} {monthGenitive}
          </h2>
          <span className="slots-subtitle">Свободное время</span>
        </div>
        <div className="slots-count-badge">
          {formatSlotsCount(availableSlotsCount)}
        </div>
      </div>

      <div className="time-slots-grid">
        {slots.map((slot) => {
          const timeStr = typeof slot === "string" ? slot : slot.time;
          const isAvailable = typeof slot === "string" ? true : slot.available;
          const isSelected = selectedTime === timeStr;

          if (!isAvailable) {
            return (
              <button
                key={timeStr}
                type="button"
                className="time-slot booked"
                disabled
              >
                {timeStr}
              </button>
            );
          }

          return (
            <button
              key={timeStr}
              type="button"
              className={`time-slot ${isSelected ? "selected" : ""}`}
              onClick={() => onSelectTime(timeStr)}
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
  );
}
