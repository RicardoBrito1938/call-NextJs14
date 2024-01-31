import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  return Response.json(request.body, {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}

export async function POST(request: Request) {
  const cookieStore = cookies();

  const requestBody = await request.json();
  const { name, username } = requestBody;

  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (userExists) {
    return Response.json(
      {
        error: "User name already taken",
      },
      {
        status: 400,
      }
    );
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
    },
  });

  cookieStore.set({
    name: "@call:userId",
    value: user.id,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return Response.json(user, {
    status: 201,
  });
}
