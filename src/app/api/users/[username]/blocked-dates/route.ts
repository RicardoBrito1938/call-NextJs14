import { prisma } from "@/lib/prisma";
import { type NextRequest } from "next/server";

interface IURLParams {
  params: { username: string };
}

//http://localhost:3000/api/users/ricardo/blocked-dates?year=2024&month=02

export async function GET(request: NextRequest, { params }: IURLParams) {
  const searchQueryParams = request.nextUrl.searchParams;

  const year = searchQueryParams.get("year");
  const month = searchQueryParams.get("month");

  const username = params.username;

  if (!year || !month) {
    return Response.json(
      { error: "Yes or Month have not been specified" },
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

  const availableWeekDays = await prisma.userTimeInterval.findMany({
    select: {
      week_day: true,
    },
    where: {
      user_id: user.id,
    },
  });

  const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter((weekDay) => {
    return !availableWeekDays.some(
      (availableDate) => availableDate.week_day === weekDay
    );
  });

  const blockedDatesRaw: { day: number }[] = await prisma.$queryRaw`
      SELECT DAY(S.date) AS day,
      COUNT(S.DATE) AS amount,
      ((UTI.time_end_in_minutes - UTI.time_start_in_minutes ) / 60) AS size

      FROM schedulings S

      LEFT JOIN user_time_intervals UTI
       ON UTI.week_day = DATEPART(dw, DATEADD(day, 1 , S.date))

      WHERE S.user_id = ${user.id}
      AND FORMAT(S.date, 'yyyy-MM') = ${`${year}-${month}`}

      GROUP BY
        DAY(S.date),
        ((UTI.time_end_in_minutes - UTI.time_start_in_minutes ) / 60)

      HAVING COUNT(S.DATE) >= ((UTI.time_end_in_minutes - UTI.time_start_in_minutes ) / 60)
  `;

  const blockedDates = blockedDatesRaw.map((blockedDate) => blockedDate.day);

  return Response.json({ blockedWeekDays, blockedDates });
}
