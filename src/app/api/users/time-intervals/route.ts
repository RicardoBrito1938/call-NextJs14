import { z } from "zod";
import { auth } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const timeIntervalsBodySchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number().min(0).max(6),
      startTimeInMinutes: z.number().min(0).max(1440),
      endTimeInMinutes: z.number().min(0).max(1440),
    })
  ),
});

export async function POST(request: Request) {
  const session = await auth();
  const requestBody = await request.json();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { intervals } = timeIntervalsBodySchema.parse(requestBody);

  // //time to create a proper SQL server, but not today Satan
  // //for me in the future, instead of using Promise.all, we could use createMany, but sqlite does not support many inserts at once

  await Promise.all(
    intervals.map((interval) => {
      return prisma.userTimeInterval.create({
        data: {
          week_day: interval.weekDay,
          time_start_in_minutes: interval.startTimeInMinutes,
          time_end_in_minutes: interval.endTimeInMinutes,
          user_id: session.user?.id,
        },
      });
    })
  );

  // //CQRS = Command Query Responsibility Segregation
  return Response.json({ success: true }, { status: 201 });
}
