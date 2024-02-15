import { getGoogleOAuthToken } from "@/lib/google";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { google } from "googleapis";
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

  const scheduling = await prisma.scheduling.create({
    data: {
      date: schedulingDate.toDate(),
      name,
      email,
      comments,
      user_id: user.id,
    },
  });

  const calendar = google.calendar({
    version: "v3",
    auth: await getGoogleOAuthToken(user.id),
  });

  await calendar.events.insert({
    calendarId: "primary",
    conferenceDataVersion: 1,
    requestBody: {
      summary: "Scheduling with " + name,
      description: comments,
      start: {
        dateTime: schedulingDate.format(),
      },
      end: {
        dateTime: schedulingDate.add(1, "hour").format(),
      },
      attendees: [
        {
          email,
          displayName: name,
        },
      ],
      conferenceData: {
        createRequest: {
          requestId: scheduling.id,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    },
  });

  return new Response(null, { status: 201 });
}
