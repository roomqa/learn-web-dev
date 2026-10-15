// API-клиент. Все запросы к серверу — здесь.
//
// Компоненты не должны знать про fetch, URL и JSON. Они вызывают
// функцию и получают данные или ошибку.

async function request(url) {
  const response = await fetch(url);

  if (!response.ok) {
    let message = `HTTP error ${response.status}`;
    try {
      const data = await response.json();
      if (data && data.error) message = data.error;
    } catch {
      // Тело не JSON — оставляем базовый текст
    }
    throw new Error(message);
  }

  return response.json();
}

// GET /api/booking/today
// Возвращает «сегодня» по мнению сервера: { day, month, year } (месяц 0-индексный).
export async function fetchToday() {
  return request("/api/booking/today");
}

// GET /api/slots?day=&month=&year=
// Возвращает слоты для указанной даты: { date: { day, month, year }, slots: [{ time, available }] }.
export async function fetchSlots(date) {
  const url = `/api/slots?day=${date.day}&month=${date.month}&year=${date.year}`;
  return request(url);
}
