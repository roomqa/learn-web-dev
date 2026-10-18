import { useState, useEffect } from "react";
import Header from "./components/Header";
import Calendar from "./components/Calendar";
import TimeSlots from "./components/TimeSlots";
import BookingBottomBar from "./components/BookingBottomBar";
import Footer from "./components/Footer";
import { fetchToday, fetchSlots } from "./api";
import {
  MONTHS_GENITIVE,
  DAYS_OF_WEEK,
  compareDates,
  isDateSelectable,
} from "./data/date";

export default function App() {
  // 1. Состояние для «сегодня» с сервера
  const [today, setToday] = useState(null);
  const [isTodayLoading, setIsTodayLoading] = useState(true);
  const [todayError, setTodayError] = useState(null);

  // 2. Состояние календаря (отображаемый месяц и год, инициализируются из today сервера)
  const [currentYear, setCurrentYear] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(null);

  // 3. Состояние выбранной даты и времени
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // 4. Состояние слотов
  const [slotsData, setSlotsData] = useState([]);
  const [isSlotsLoading, setIsSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);

  const master = {
    name: "Анна Волкова",
    price: 2800,
  };

  // Шаг 1. Загрузка «сегодня» при открытии страницы
  useEffect(() => {
    let isMounted = true;
    setIsTodayLoading(true);
    setTodayError(null);

    fetchToday()
      .then((data) => {
        if (!isMounted) return;
        setToday(data);
        setCurrentYear(data.year);
        setCurrentMonth(data.month);
        setSelectedYear(data.year);
        setSelectedMonth(data.month);
        setSelectedDay(data.day);
        setIsTodayLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setTodayError(err.message);
        setIsTodayLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Шаг 2. Загрузка слотов при смене дня/месяца (сброс ошибки и включение загрузки внутри useEffect)
  useEffect(() => {
    if (!selectedDay || selectedMonth === null || selectedYear === null) {
      setSlotsData([]);
      setIsSlotsLoading(false);
      setSlotsError(null);
      return;
    }

    let isMounted = true;
    // Сбрасываем ошибку и включаем загрузку перед новым запросом непосредственно внутри useEffect
    setIsSlotsLoading(true);
    setSlotsError(null);

    const targetDate = {
      day: selectedDay,
      month: selectedMonth,
      year: selectedYear,
    };

    fetchSlots(targetDate)
      .then((res) => {
        // Защита от гонок: проверяем, что ответ соответствует текущей дате
        if (
          isMounted &&
          res.date &&
          res.date.day === targetDate.day &&
          res.date.month === targetDate.month &&
          res.date.year === targetDate.year
        ) {
          setSlotsData(res.slots || []);
          setIsSlotsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setSlotsError(err.message);
          setIsSlotsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDay, selectedMonth, selectedYear]);

  // Синхронизация выбранной даты и времени с отображаемым месяцем
  const syncMonth = (nextMonth, nextYear) => {
    setCurrentMonth(nextMonth);
    setCurrentYear(nextYear);
    setSelectedMonth(nextMonth);
    setSelectedYear(nextYear);
    setSelectedTime(null); // Сброс времени при смене месяца

    const isCurrentMonth = today && nextYear === today.year && nextMonth === today.month;
    const isFutureMonth =
      today &&
      compareDates({ day: 1, month: nextMonth, year: nextYear }, today) > 0;

    let nextDay = null;
    if (isCurrentMonth) {
      nextDay = today.day;
    } else if (isFutureMonth) {
      nextDay = 1;
    }

    setSelectedDay(nextDay);
  };

  const handlePrevMonth = () => {
    let nextMonth = currentMonth - 1;
    let nextYear = currentYear;
    if (nextMonth < 0) {
      nextMonth = 11;
      nextYear -= 1;
    }
    syncMonth(nextMonth, nextYear);
  };

  const handleNextMonth = () => {
    let nextMonth = currentMonth + 1;
    let nextYear = currentYear;
    if (nextMonth > 11) {
      nextMonth = 0;
      nextYear += 1;
    }
    syncMonth(nextMonth, nextYear);
  };

  const handleDayClick = (day) => {
    if (!day) return;
    if (today && !isDateSelectable(day, currentMonth, currentYear, today)) {
      return;
    }

    setSelectedYear(currentYear);
    setSelectedMonth(currentMonth);
    setSelectedDay(day);
    setSelectedTime(null); // Обязательный сброс времени при смене дня
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

  // Если «сегодня» ещё загружается — показываем «Загрузка…»
  if (isTodayLoading) {
    return (
      <div className="app-wrapper">
        <Header />
        <main className="booking-main">
          <div className="loading-state">Загрузка…</div>
        </main>
        <Footer />
      </div>
    );
  }

  // Если ошибка загрузки «сегодня» — показываем сообщение об ошибке
  if (todayError) {
    return (
      <div className="app-wrapper">
        <Header />
        <main className="booking-main">
          <div className="error-state">Ошибка: {todayError}</div>
        </main>
        <Footer />
      </div>
    );
  }

  const selectedDateObj = selectedDay
    ? new Date(selectedYear, selectedMonth, selectedDay)
    : null;
  const dayOfWeekName = selectedDateObj
    ? DAYS_OF_WEEK[selectedDateObj.getDay()]
    : "";
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
              today={today}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onSelectDay={handleDayClick}
            />

            <TimeSlots
              selectedDay={selectedDay}
              monthGenitive={monthGenitive}
              dayOfWeekName={dayOfWeekName}
              slotsData={slotsData}
              isSlotsLoading={isSlotsLoading}
              slotsError={slotsError}
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
