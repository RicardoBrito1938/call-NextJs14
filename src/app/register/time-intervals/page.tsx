"use client";
import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from "@ignite-ui/react";
import { ArrowRight } from "phosphor-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Container, Header } from "../styles";

import {
  FormError,
  IntervalBox,
  IntervalContainer,
  IntervalDay,
  IntervalInputs,
  IntervalItem,
} from "./styles";
import { getWeekDays } from "@/utils/get-week-days";
import { zodResolver } from "@hookform/resolvers/zod";
import { convertTimeStringToMinutes } from "@/utils/convert-time-string-to-minutes";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: "At least one interval must be enabled",
    })
    .transform((intervals) => {
      return intervals.map((interval) => {
        return {
          weekDay: interval.weekDay,
          startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
          endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
        };
      });
    })
    .refine(
      (intervals) => {
        return intervals.every(
          (interval) =>
            interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes
        );
      },
      {
        message: "End time must be at least 1 hour after start time",
      }
    ),
});

type TimeIntervalsFormDataOutput = z.output<typeof timeIntervalsFormSchema>;
type TimeIntervalsFormDataInput = z.input<typeof timeIntervalsFormSchema>;

export default function TimeIntervals() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<TimeIntervalsFormDataInput>({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: "08:00", endTime: "18:00" },
        { weekDay: 1, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 2, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 3, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 4, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 5, enabled: true, startTime: "08:00", endTime: "18:00" },
        { weekDay: 6, enabled: false, startTime: "08:00", endTime: "18:00" },
      ],
    },
  });

  const weekDays = getWeekDays();

  const { fields } = useFieldArray({
    control,
    name: "intervals",
  });

  const intervals = watch("intervals");
  const router = useRouter();

  const handleSetTimeIntervals = async (data: TimeIntervalsFormDataInput) => {
    const { intervals } = data;
    await api.post("/users/time-intervals", { intervals });

    router.push("/register/profile");
  };

  return (
    <Container>
      <Header>
        <Heading as="strong">Almost there</Heading>
        <Text>Define the time intervals for your availability</Text>

        <MultiStep size={4} currentStep={3} />
      </Header>

      <IntervalBox as="form" onSubmit={handleSubmit(handleSetTimeIntervals)}>
        <IntervalContainer>
          {fields.map((field, index) => {
            return (
              <IntervalItem key={field.id}>
                <IntervalDay>
                  <Controller
                    name={`intervals.${index}.enabled`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        onCheckedChange={(checked) => {
                          field.onChange(checked === true);
                        }}
                        checked={field.value}
                      />
                    )}
                  />

                  <Text>{weekDays[field.weekDay]}</Text>
                </IntervalDay>
                <IntervalInputs>
                  <TextInput
                    crossOrigin="anonymous"
                    size="sm"
                    type="time"
                    step={60}
                    disabled={!intervals[index].enabled}
                    {...register(`intervals.${index}.startTime`)}
                  />
                  <TextInput
                    crossOrigin="anonymous"
                    size="sm"
                    type="time"
                    step={60}
                    disabled={!intervals[index].enabled}
                    {...register(`intervals.${index}.endTime`)}
                  />
                </IntervalInputs>
              </IntervalItem>
            );
          })}
        </IntervalContainer>

        {!!errors?.intervals && (
          <FormError>{errors?.intervals?.root?.message}</FormError>
        )}

        <Button type="submit" disabled={isSubmitting}>
          Next step
          <ArrowRight />
        </Button>
      </IntervalBox>
    </Container>
  );
}
