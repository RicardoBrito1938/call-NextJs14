import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { type NextRequest } from "next/server";
import { z } from "zod";

interface IURLParams {
  params: { username: string };
}

const createSchedulingBody = z.object({
  name: z.string(),
  email: z.string(),
  comments: z.string(),
  date: z.string().datetime(),
});

export async function POST(request: Request, { params }: IURLParams) {
  const requestBody = await request.json();

  const username = params.username;

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

  const { name, email, comments, date } =
    createSchedulingBody.parse(requestBody);

  const schedulingDate = dayjs(date).startOf("hour");

  if (schedulingDate.isBefore(new Date())) {
    return Response.json(
      { error: "Scheduling date is in the past" },
      {
        status: 400,
      }
    );
  }

  const conflictingScheduling = await prisma.scheduling.findFirst({
    where: {
      date: schedulingDate.toDate(),
      user_id: user.id,
    },
  });

  if (conflictingScheduling) {
    return Response.json(
      { error: "Scheduling date is already taken" },
      {
        status: 400,
      }
    );
  }

  await prisma.scheduling.create({
    data: {
      date: schedulingDate.toDate(),
      name,
      email,
      comments,
      user_id: user.id,
    },
  });

  return new Response(null, { status: 201 });
}
