import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { type NextRequest } from "next/server";

interface IURLParams {
  params: { username: string };
}

export async function GET(request: NextRequest, { params }: IURLParams) {
  const searchQueryParams = request.nextUrl.searchParams;

  const date = searchQueryParams.get("date");
  const username = params.username;

  if (!date) {
    return Response.json(
      { error: "Date is required" },
      {
        status: 400,
      }
    );
  }

  if (!username) {
    return Response.json(
      { error: "Username is required" },
      {
        status: 400,
      }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return Response.json(
      { error: "User not found" },
      {
        status: 404,
      }
    );
  }

  const referenceDate = dayjs(String(date));
  const isPastDate = referenceDate.endOf("day").isBefore(new Date());

  if (isPastDate) {
    return Response.json({ possibleTimes: [], availableTimes: [] });
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get("day"),
    },
  });

  if (!userAvailability) {
    return Response.json({ possibleTimes: [], availableTimes: [] });
  }

  const { time_end_in_minutes, time_start_in_minutes } = userAvailability;

  const startHour = time_start_in_minutes / 60;
  const endHour = time_end_in_minutes / 60;

  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, i) => {
      const hour = startHour + i;
      return hour;
    }
  );

  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.set("hour", startHour).toDate(),
        lte: referenceDate.set("hour", endHour).toDate(),
      },
    },
  });

  const availableTimes = possibleTimes.filter((time) => {
    const isTimeBlocked = !blockedTimes.some(
      (blockedTime) => blockedTime.date.getHours() === time
    );

    const isTimePast = referenceDate.set("hour", time).isBefore(new Date());

    return !isTimePast && !isTimeBlocked;
  });

  return Response.json({ possibleTimes, availableTimes });
}
