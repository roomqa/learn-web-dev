import { useState } from "react";
import Header from "./components/Header";
import Calendar from "./components/Calendar";
import TimeSlots from "./components/TimeSlots";
import BookingBottomBar from "./components/BookingBottomBar";
import Footer from "./components/Footer";
import {
  MONTHS_GENITIVE,
  DAYS_OF_WEEK,
  TODAY,
  isDateSelectable,
  getSlotsForDate,
} from "./data/date";

export default function App() {
  // Пять значений состояния (Шаг 3 задания)
  const [currentYear, setCurrentYear] = useState(TODAY.year);
  const [currentMonth, setCurrentMonth] = useState(TODAY.month);
  const [selectedDay, setSelectedDay] = useState(TODAY.day);
  const [selectedTime, setSelectedTime] = useState(null);
  const [slots, setSlots] = useState(() =>
    getSlotsForDate(TODAY.year, TODAY.month, TODAY.day)
  );

  // Для точной привязки выбранного дня к выбранному месяцу и году при навигации
  const [selectedYear, setSelectedYear] = useState(TODAY.year);
  const [selectedMonth, setSelectedMonth] = useState(TODAY.month);

  const master = {
    name: "Анна Волкова",
    price: 2800,
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleDayClick = (day) => {
    if (!day) return;
    if (!isDateSelectable(day, currentMonth, currentYear, TODAY)) {
      return;
    }

    setSelectedYear(currentYear);
    setSelectedMonth(currentMonth);
    setSelectedDay(day);
    setSelectedTime(null); // Обязательный сброс времени при смене дня
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
      date: {
        day: selectedDay,
        month: selectedMonth + 1,
        year: selectedYear,
      },
      time: selectedTime,
    };
    localStorage.setItem("moss-booking", JSON.stringify(payload));
    alert(
      `Запись сохранена!\nДата: ${selectedDay} ${MONTHS_GENITIVE[selectedMonth]} ${selectedYear}\nВремя: ${selectedTime}\nМастер: ${master.name}`
    );
  };

  const selectedDateObj = new Date(selectedYear, selectedMonth, selectedDay);
  const dayOfWeekName = DAYS_OF_WEEK[selectedDateObj.getDay()];
  const monthGenitive = MONTHS_GENITIVE[selectedMonth];

  return (
    <div className="app-wrapper">
      <Header />

      <main className="booking-main">
        <div className="booking-container">
          <div className="top-controls">
            <a href="#" className="back-link">‹ Назад</a>
            <div className="service-pill">Стрижка · 60 мин</div>
          </div>

          <section className="page-heading">
            <h1 className="main-title">Когда тебе удобно?</h1>
            <p className="main-subtitle">
              Выбери день в календаре и свободное время.
            </p>
          </section>

          <div className="booking-grid">
            <Calendar
              currentYear={currentYear}
              currentMonth={currentMonth}
              selectedDay={selectedDay}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              today={TODAY}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onSelectDay={handleDayClick}
            />

            <TimeSlots
              selectedDay={selectedDay}
              monthGenitive={monthGenitive}
              dayOfWeekName={dayOfWeekName}
              slots={slots}
              selectedTime={selectedTime}
              master={master}
              onSelectTime={handleSlotClick}
            />
          </div>

          <BookingBottomBar
            dayOfWeekName={dayOfWeekName}
            selectedDay={selectedDay}
            monthGenitive={monthGenitive}
            selectedYear={selectedYear}
            selectedTime={selectedTime}
            onContinue={handleContinue}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
