// «База данных» — пока обычный JS-объект.
//
// Содержит только то, что нужно странице календаря:
//   - today — «сегодня» по мнению сервера;
//   - slotsEvenDay / slotsOddDay — два набора слотов,
//     чтобы на клиенте было видно: при смене дня данные разные.
export const database = {
  // «Сегодня» по мнению сервера (вычисляется динамически на основе текущей даты).
  get today() {
    const now = new Date();
    return {
      day: now.getDate(),
      month: now.getMonth(),
      year: now.getFullYear(),
    };
  },

  // Слоты для чётных дней (2, 4, 6, ...)
  slotsEvenDay: [
    { time: "10:00", available: true },
    { time: "10:30", available: true },
    { time: "11:00", available: true },
    { time: "11:30", available: true },
    { time: "12:00", available: false },
    { time: "13:00", available: false },
    { time: "14:30", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: true },
    { time: "17:30", available: true },
    { time: "18:00", available: true },
    { time: "19:30", available: true },
  ],

  // Слоты для нечётных дней (1, 3, 5, ...)
  slotsOddDay: [
    { time: "10:00", available: true },
    { time: "10:30", available: true },
    { time: "11:00", available: false },
    { time: "11:30", available: true },
    { time: "12:00", available: true },
    { time: "13:00", available: true },
    { time: "14:30", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: false },
    { time: "17:30", available: true },
    { time: "18:00", available: true },
    { time: "19:30", available: true },
  ],
};
