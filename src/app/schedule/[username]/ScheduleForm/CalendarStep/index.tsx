import { Calendar } from "@/components/Calendar";
import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from "./styles";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface IAvailability {
  possibleTimes: number[];
  availableTimes: number[];
}

interface CalendarStepProps {
  onSelectDateTime: (date: Date) => void;
}

export const CalendarStep = ({ onSelectDateTime }: CalendarStepProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { username } = useParams();

  const isDateSelected = !!selectedDate;

  const weekDay = selectedDate ? dayjs(selectedDate).format("dddd") : null;
  const formattedDay = selectedDate
    ? dayjs(selectedDate).format("DD of MMM")
    : null;

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format("YYYY-MM-DD")
    : null;

  const queryFn = async () => {
    const response = await api.get(`/users/${username}/availability`, {
      params: {
        date: selectedDateWithoutTime,
      },
    });

    return response.data;
  };

  const { data: availability } = useQuery<IAvailability>({
    queryKey: ["availability", selectedDateWithoutTime],
    queryFn,
    enabled: !!selectedDate,
  });

  const handleSelectTime = (hour: number) => {
    const dateWithTime = dayjs(selectedDate)
      .set("hour", hour)
      .startOf("hour")
      .toDate();

    onSelectDateTime(dateWithTime);
  };

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />
      {isDateSelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekDay} <span>{formattedDay}</span>
          </TimePickerHeader>

          <TimePickerList>
            {availability?.possibleTimes.map((hour) => {
              return (
                <TimePickerItem
                  key={hour}
                  disabled={!availability.availableTimes.includes(hour)}
                  onClick={() => handleSelectTime(hour)}
                >
                  {String(hour).padStart(2, "0")}: 00h
                </TimePickerItem>
              );
            })}
          </TimePickerList>
        </TimePicker>
      )}{" "}
    </Container>
  );
};
