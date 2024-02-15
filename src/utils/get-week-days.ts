import dayjs from "dayjs";

interface GetWeekDaysParams {
  short?: boolean;
}

export function getWeekDays({ short = false }: GetWeekDaysParams = {}) {
  // Define the weekdays starting from Sunday
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  if (short) {
    // If short is true, return the abbreviated form (first three letters) and uppercase
    return weekDays.map((day) => day.substring(0, 3).toUpperCase());
  }
  return weekDays.map(
    (day) => day.substring(0, 1).toUpperCase() + day.substring(1)
  );
}
