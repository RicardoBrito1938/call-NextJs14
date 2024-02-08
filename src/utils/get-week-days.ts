export const getWeekDays = () => {
  const formatter = new Intl.DateTimeFormat("en-UK", { weekday: "long" });

  return Array.from(Array(7).keys())
    .map((day) => formatter.format(new Date(Date.UTC(2024, 5, day))))
    .map((weekDay) => {
      return weekDay.substring(0, 1).toUpperCase().concat(weekDay.substring(1));
    });
};
